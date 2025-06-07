import {  Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ITiquete } from '../../models/tiquete.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IParqueo } from '../../models/parqueo.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tiquetes',
  imports: [CommonModule, FormsModule],
  templateUrl: './tiquetes.component.html',
  styleUrl: './tiquetes.component.css'
})
export class TiquetesComponent implements OnInit {
  
  
  private _apiService = inject(ApiService);
  private _router = inject(Router);
  tiqueteList: ITiquete[] = []; 
  parqueoList: IParqueo [] = []

  searchPlate: string = '';

 ngOnInit(): void {
     this._apiService.getAllTiquetes().subscribe(
       (data: ITiquete[]) => {
         this.tiqueteList = data; // Assign the fetched data to clienteList
       },
       (error) => {
         console.error('Error fetching clients:', error);
       }
     );

     this._apiService.getAllParqueos().subscribe(
      (data: IParqueo[])=>{
        this.parqueoList = data;
      },
      (error)=>{
        console.error('Error fetching parqueos:', error)
      }
     );
   }

   obtenerNombreParqueo(parqueoId: number): string {
    const parqueo = this.parqueoList.find(p => p.id === parqueoId);
    return parqueo ? parqueo.nombre : 'Desconocido';
  }

  goTo(path: string):void { //revisar esto
    this._router.navigate([`/dashboard/${path}`]);

  }
   

  
 // Función para verificar si la placa coincide con la búsqueda
 isMatchingPlate(placa: string): boolean {
  if (this.searchPlate.trim() === '') {
    return false; // Si no hay búsqueda, no resaltar ninguna fila
  }
  return placa.toLowerCase().includes(this.searchPlate.toLowerCase());
}




  
}
