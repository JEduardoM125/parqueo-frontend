import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register-employee',
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule for template-driven forms
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.css'
})
export class RegisterEmployeeComponent {

  username: string = '';
  password: string = '';
  //role: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  email: string = ''; // Add email property

  private _apiService = inject(ApiService); // Inject the ApiService

  private _router = inject(Router); // Inject the Router

  

    registerUserPublic() {
      const newUser = {
        username: this.username,
        password: this.password,
        //role: this.role,
        email: this.email // Include email in the newUser object
      };
    
      this._apiService.registerEmployee(newUser).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage = response.message;
          this.errorMessage = '';
          setTimeout(() => {
            this._router.navigate(['/login']); // Redirige después de mostrar el mensaje
          }, 1500);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.error?.error || 'Ocurrió un error inesperado.';
          this.successMessage = '';
        }
      });
    }
    
    navigateToLogin() {
    this._router.navigate(['/login']);
  }
}
