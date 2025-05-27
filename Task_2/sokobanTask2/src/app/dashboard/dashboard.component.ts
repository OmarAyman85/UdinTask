import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  currentUserName: string = '';
  topUsers: Array<{ username: string; score: number }> = [];

  constructor(private authService: AuthService, private auth: Auth) {}

  ngOnInit(): void {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.authService.getUserData(user.uid).subscribe((userData) => {
          this.currentUserName = userData?.username ?? '';
        });
        this.authService.getTopUsers().subscribe((users) => {
          this.topUsers = users;
        });
      } else {
        this.currentUserName = '';
        this.topUsers = [];
      }
    });
  }
}
