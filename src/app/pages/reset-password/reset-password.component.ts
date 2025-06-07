import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [ FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  private _apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Estado reactivo con Signals
  token = signal<string>('');
  newPassword = signal('');
  confirmPassword = signal('');
  email = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (!email) {
      this.router.navigate(['/forgot-password']);
    }
    this.email.set(email || '');
  }

  
  async onSubmit() {
    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }
  
    if (this.newPassword().length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
  
    this.isLoading.set(true);
    this.errorMessage.set('');
  
    try {
      const response = await lastValueFrom( // Convertimos el Observable a Promise para usar async/await //lastValueFrom es una función de RxJS que convierte un Observable en una Promise
        this._apiService.resetPassword(
          this.token(),
          this.newPassword()
        )
      );
      
      // Verifica si la respuesta indica éxito
      if (response?.success) {
        this.router.navigate(['/login'], {
          queryParams: 
          { passwordReset: 'success',
            message: response.message || 'Contraseña restablecida con éxito. Puede iniciar sesión.'
          }
        });
      } else {
        this.errorMessage.set(
            response?.error ||
            response?.message ||
          'No se pudo restablecer la contraseña. Intente nuevamente.'
        );
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      this.errorMessage.set(
        error?.message || 
        error?.error ||
        'Error al restablecer la contraseña. Verifique el token e intente nuevamente.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }


  login(): void {
    // This method is called when the user clicks the "Register" button
    this.router.navigate(['/login']); // Navigate to the registration page
  }
}
