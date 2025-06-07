import { Component, inject, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
import { Router } from '@angular/router'; // Import Router for navigation	
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService for authentication


  @Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterOutlet], // Import CommonModule for ngIf, ngFor, etc.
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'], // Corrected 'styleUrl' to 'styleUrls'
    encapsulation: ViewEncapsulation.None, // Use None to apply global styles
})


export class DashboardComponent {

  private _router = inject(Router); // Inject the Router
  private _authService = inject(AuthService); // Inject the AuthService
 
  public userRole: string = ''; // User role
  public currentTheme: 'light' | 'dark' = 'light'; // Default theme

  //Navega a una ruta hija dentro del dashboard

  goTo(path: string) {
    this._router.navigate([`/dashboard/${path}`]); // Navigate to the specified child route

  }

    /**
   * Cierra la sesión y redirige al login.
   */
  logoutSession(){
    this._authService.logoutWithToken(); // Call the logout method from AuthService
  }

  // Propiedad pública para el rol (optimización)
  public currentRole = this._authService.getRole(); 
  

  

}
