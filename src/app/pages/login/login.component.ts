import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'; // Import Router for navigation
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule for template-driven forms
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private _apiService = inject(ApiService); // Inject the ApiService
  private _router = inject(Router); // Inject the Router
  private _authService = inject(AuthService); // Inject the AuthService

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = "Username and Password cannot be empty!";
      return;
    }

    this._apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        this._authService.loginWithToken(response.token); // Usar el AuthService para guardar el token
        this._router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }


  register(): void {
    // This method is called when the user clicks the "Register" button
    this._router.navigate(['/register-employee']); // Navigate to the registration page
  }

  requestReset(): void {
    this._router.navigate(['/request-reset']); // Navigate to the password reset page
  }

}
