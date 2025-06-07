import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ICliente } from '../../models/client.model';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.

@Component({
  selector: 'app-clientes',
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  clienteList: ICliente[] = []; // Initialize the clienteList array

  ngOnInit(): void {
    this._apiService.getAllClients().subscribe(
      (data: ICliente[]) => {
        this.clienteList = data; // Assign the fetched data to clienteList
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  goTo(path: string):void { //revisar esto
    this._router.navigate([`/dashboard/${path}`]);

  }

}
