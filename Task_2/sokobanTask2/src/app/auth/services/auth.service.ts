import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$!: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this._user$ = authState(this.auth);
    this.isLoggedIn$ = this._user$.pipe(map((user) => !!user));
  }

  /**
   * Registers a new user with email and password in Firebase Auth,
   * then stores additional profile data (username, role, score) in Firestore.
   *
   * @param email - User's email address
   * @param password - User's chosen password
   * @param username - Optional username, defaults to empty string
   * @param role - User role, defaults to 'player'
   * @returns Observable emitting the created Firebase User object
   */
  register(
    email: string,
    password: string,
    username: string = '',
    role: string = 'player'
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        async (credential) => {
          const uid = credential.user.uid;
          const userRef = doc(this.firestore, `users/${uid}`);

          // Save extra user info in Firestore under users collection
          await setDoc(userRef, {
            email,
            username,
            role,
            score: 0,
          });

          // Return the authenticated user object
          return credential.user;
        }
      )
    );
  }

  /**
   * Determines the next available number suffix for an anonymous username.
   * For example, if existing anonymous users are "anonymous1", "anonymous2",
   * this returns 3.
   *
   * @returns Observable emitting the next anonymous number to use
   */
  getNextAnonymousNumber(): Observable<number> {
    const usersRef = collection(this.firestore, 'users');
    const usersQuery = query(usersRef, orderBy('username', 'desc'));

    return from(getDocs(usersQuery)).pipe(
      map((snapshot) => {
        let maxNum = 0;
        snapshot.docs.forEach((doc) => {
          const username = doc.data()['username'] as string;
          if (username?.startsWith('anonymous')) {
            const suffix = username.substring('anonymous'.length);
            const num = Number(suffix);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        });
        return maxNum + 1;
      })
    );
  }

  /**
   * Logs in an existing user using email and password authentication.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Observable emitting the authenticated Firebase User object
   */
  login(email: string, password: string): Observable<User> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(
        (credential) => credential.user
      )
    );
  }

  /**
   * Logs out the currently signed-in user.
   *
   * @returns Observable that completes when logout finishes
   */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Synchronously returns the currently signed-in user, if any.
   * This is a snapshot and does not update reactively.
   *
   * @returns Firebase User object or null if no user signed in
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Retrieves additional user profile data from Firestore for the given UID.
   *
   * @param uid - User's Firebase Authentication UID
   * @returns Observable emitting an object with username and score,
   *          or null if user document does not exist
   */
  getUserData(
    uid: string
  ): Observable<{ username: string; score: number } | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) return null;
        const data = docSnap.data();
        return {
          username: data?.['username'] || '',
          score: data?.['score'] || 0,
        };
      })
    );
  }

  /**
   * Fetches a list of top users sorted by their score in descending order.
   *
   * @param limitCount - Number of users to retrieve (default 10)
   * @returns Observable emitting an array of user objects { username, score }
   */
  getTopUsers(
    limitCount: number = 10
  ): Observable<Array<{ username: string; score: number }>> {
    const usersRef = collection(this.firestore, 'users');
    const topUsersQuery = query(
      usersRef,
      orderBy('score', 'desc'),
      limit(limitCount)
    );

    return from(getDocs(topUsersQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            username: data['username'] || '',
            score: data['score'] ?? 0,
          };
        })
      )
    );
  }
}
