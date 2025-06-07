import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IParqueo } from '../../models/parqueo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cerrar-tiquete',
  imports: [CommonModule],
  templateUrl: './cerrar-tiquete.component.html',
  styleUrl: './cerrar-tiquete.component.css'
})
export class CerrarTiqueteComponent implements OnInit{

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute); //a través de parámetros en la URL SE OBTIENE EL ID


  resumen: any;
  error: string = '';

  idTiquete!: number;

  parqueoList: IParqueo[] = [];

  ngOnInit(): void {
    this.idTiquete = +this._route.snapshot.paramMap.get('id')!;
    this._apiService.getResumenCierre(this.idTiquete).subscribe({
      next: data => this.resumen = data,
      error: err => this.error = 'No se pudo cargar el resumen del tiquete.'
    });
  }

  confirmarCierre(): void {
    this._apiService.cerrarTiquete(this.idTiquete).subscribe({
      next: () => {
        alert('Tiquete cerrado exitosamente');
        this._router.navigate(['/dashboard/tiquetes']); // o lista de tiquetes
      },
      error: () => {
        alert('Error al cerrar el tiquete.');
      }
    });
  }

  goTo():void { //revisar esto
    this._router.navigate([`/dashboard/tiquetes`]);

  }
  
}
