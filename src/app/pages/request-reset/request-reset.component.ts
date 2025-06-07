import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './request-reset.component.html',
  styleUrl: './request-reset.component.css'
})
export class RequestResetComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Signals
  email = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  async onSubmit() {
    if (!this.email().trim()) {
      this.errorMessage.set('El email es requerido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      // Convertimos el Observable a Promise para usar async/await
      await this.apiService.forgotPassword(this.email()).toPromise();
      
      this.successMessage.set('Se ha enviado un correo con las instrucciones');
      setTimeout(() => {
        this.router.navigate(['/reset-password'], {
          queryParams: { email: this.email() }
        });
      }, 2000);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al solicitar el token');
    } finally {
      this.isLoading.set(false);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}




