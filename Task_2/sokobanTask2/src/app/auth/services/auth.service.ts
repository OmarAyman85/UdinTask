import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  DocumentData,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, from, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  register(
    email: string,
    password: string,
    username: string = '',
    role: string = 'player'
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        async (cred) => {
          const uid = cred.user.uid;
          // Save additional user info to Firestore
          const userRef = doc(this.firestore, `users/${uid}`);
          await setDoc(userRef, {
            email,
            username,
            role,
            score: 0,
          });
          return cred.user;
        }
      )
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(
        (cred) => cred.user
      )
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getUserData(
    uid: string
  ): Observable<{ username: string; score: number } | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) return null;
        const data = docSnap.data();
        return {
          username: data['username'] || '',
          score: data['score'] || 0,
        };
      })
    );
  }

  getTopUsers(
    limitCount: number = 10
  ): Observable<Array<{ username: string; score: number }>> {
    const usersRef = collection(this.firestore, 'users');
    const topQuery = query(
      usersRef,
      orderBy('score', 'desc'),
      limit(limitCount)
    );

    return from(getDocs(topQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            username: data['username'],
            score: data['score'] ?? 0,
          };
        })
      )
    );
  }
}
