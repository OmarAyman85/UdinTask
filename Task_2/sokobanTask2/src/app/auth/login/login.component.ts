import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // corrected plural property
})
export class LoginComponent {
  // Bound to login form inputs
  email = '';
  password = '';
  errorMsg = ''; // Stores error messages to display in the UI

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Handles login form submission.
   * Calls AuthService to authenticate user with email and password.
   * On success, navigates to the dashboard.
   * On failure, captures and displays error message.
   */
  onLogin(): void {
    this.errorMsg = ''; // Clear previous errors

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Successful login: redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Capture and display error message from backend
        this.errorMsg = err?.message || 'Login failed. Please try again.';
      },
    });
  }
}
