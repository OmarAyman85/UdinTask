import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // Form fields bound to inputs in the template
  email = '';
  password = '';
  username = '';
  role = 'player'; // Default user role
  errorMsg = ''; // Stores any registration error messages
  isSubmitting = false; // Indicates ongoing registration to disable form inputs

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Triggered on registration form submission.
   * If role is 'anonymous', generates a unique username automatically
   * before proceeding with registration. Otherwise, uses provided username.
   */
  onRegister(): void {
    // Reset error message and indicate loading state
    this.errorMsg = '';
    this.isSubmitting = true;

    /**
     * Helper function to handle the actual registration call
     * using the given username.
     * @param usernameToUse - The username to register with
     */
    const proceedWithRegistration = (usernameToUse: string) => {
      this.authService
        .register(this.email, this.password, usernameToUse, this.role)
        // finalize operator to reset loading state regardless of success or error
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            // Navigate to dashboard on successful registration
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            // Display error message from backend or fallback message
            this.errorMsg =
              err?.message || 'Registration failed. Please try again.';
          },
        });
    };

    if (this.role === 'anonymous') {
      // Generate unique anonymous username by fetching next number
      this.authService.getNextAnonymousNumber().subscribe({
        next: (nextNum) => {
          const generatedUsername = `anonymous${nextNum}`;
          proceedWithRegistration(generatedUsername);
        },
        error: () => {
          // Handle error generating anonymous username
          this.isSubmitting = false;
          this.errorMsg =
            'Could not generate anonymous username. Please try again later.';
        },
      });
    } else {
      // Use the username provided in the form after trimming whitespace
      proceedWithRegistration(this.username.trim());
    }
  }
}
