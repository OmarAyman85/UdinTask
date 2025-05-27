import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { Auth, authState, User } from '@angular/fire/auth';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserName: string = '';
  topUsers: Array<{ username: string; score: number }> = [];

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) {}

  /**
   * On component init, subscribe to auth state to fetch user and leaderboard data.
   */
  ngOnInit(): void {
    const authSub = authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        const userData$ = this.authService.getUserData(user.uid);
        const topUsers$ = this.authService.getTopUsers();

        const combinedSub = forkJoin([userData$, topUsers$]).subscribe({
          next: ([userData, users]) => {
            this.currentUserName = userData?.username ?? '';
            this.topUsers = users;
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
            this.currentUserName = '';
            this.topUsers = [];
          },
        });

        this.subscriptions.add(combinedSub);
      } else {
        this.currentUserName = '';
        this.topUsers = [];
      }
    });

    this.subscriptions.add(authSub);
  }

  /**
   * Logs out the current user using AuthService and navigates to login page.
   */
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }

  /**
   * Clean up all subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
