import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'})
export class NotificationService {
  showError(message: string): void {
    // Implementa tu lógica de notificación (ej: MatSnackBar, Toastr, etc.)
    console.error('Error:', message); // Ejemplo básico
    alert(`Error: ${message}`); // Alternativa temporal
  }
}
