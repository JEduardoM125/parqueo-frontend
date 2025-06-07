import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardResumen } from '../../models/dashboardResumen.model';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-inicio',
  imports: [CommonModule], // Import CommonModule for ngIf, ngFor, etc.
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit, OnDestroy {

 private _apiService = inject(ApiService);
   private _router = inject(Router);

   
   


 usuario: string |  null = null; // Variable para almacenar el nombre de usuario

 private _authService = inject(AuthService); // Inyectar el servicio de autenticación
 fechaActual = new Date();

  // Valores que vienen del backend
  totalEspaciosDisponibles = 0;
  tiquetesActivos = 0;
  totalClientesDelDia = 0; // Puedes mapearlo como gustes

  totalEspaciosCartago= 0;
  totalEspaciosHeredia= 0;
  
  tiquetesCerrados=0;
  

  private intervalId: any;

  ngOnInit(): void {
    this.usuario = this._authService.getUsername(); // Obtener el nombre de usuario del servicio de autenticación
    this.cargarResumen(); // Carga inicial
    this.intervalId = setInterval(() => this.cargarResumen(), 10000); // Cada 10 segundos
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Limpia el intervalo si el componente se destruye
  }

  cargarResumen(): void {
    this._apiService.getResumen().subscribe({
      next: (resumen: DashboardResumen) => {
        this.totalEspaciosDisponibles = resumen.totalEspaciosDisponibles;
        this.totalEspaciosCartago = resumen.totalEspaciosCartago;
        this.totalEspaciosHeredia = resumen.totalEspaciosHeredia;
        this.tiquetesCerrados = resumen.totalTiquetesCerrados
        this.tiquetesActivos = resumen.totalTiquetesActivos;
        this.totalClientesDelDia = resumen.totalClientesDelDia;
      },
      error: (error) => {
        console.error('Error al obtener resumen:', error);
      }
    });
  }

  

 goTo(path: string):void {
  this._router.navigate([`/dashboard/${path}`]); // Navigate to the specified child route

}
}
