import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { IParqueo } from '../../models/parqueo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parqueos',
  imports: [CommonModule],
  templateUrl: './parqueos.component.html',
  styleUrl: './parqueos.component.css'
})
export class ParqueosComponent implements OnInit {

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  parqueoList: IParqueo[] = [];

  ngOnInit(): void {
    this._apiService.getAllParqueos().subscribe(
      (data: IParqueo[]) => {
        this.parqueoList = data; // Assign the fetched data to clienteList
      },
      (error) => {
        console.error('Error fetching parqueos:', error);
      }
    );
  }

  goTo(path: string):void { //revisar esto
    this._router.navigate([`/dashboard/${path}`]);

  }

  eliminarParqueo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este parqueo?')) {
      this._apiService.deleteParqueo(id).subscribe({
        next: () => {
          this.parqueoList = this.parqueoList.filter(p => p.id !== id);
          alert('Parqueo eliminado correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar parqueo:', err);
          alert('Error eliminando parqueo.');
        }
      });
    }
  }

}
