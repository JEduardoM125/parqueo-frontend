import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICliente } from '../../models/client.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-crear-cliente',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './crear-cliente.component.html',
  styleUrl: './crear-cliente.component.css'
})
export class CrearClienteComponent implements OnInit {

    private _apiService = inject(ApiService);
    private _router = inject(Router);
    private _formBuilder = inject(FormBuilder);

  form!: FormGroup;

 

  clienteList : ICliente[] = [];

ngOnInit(): void {
  this.form=this._formBuilder.group({
    cedula: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });
}

crearCliente():void{
  if(this.form.invalid){
    this.form.markAllAsTouched();
    return;
  }
    this._apiService.createCliente(this.form.value).subscribe({
      next:()=> this._router.navigate(['/dashboard/clientes']),
      error:(err)=>{
        console.error('Error al crear el cliente:', err);
        alert('Error al crear el cliente: ' + err.error);
      }
    });
}

hasErrors(field:string, typeError:string):boolean{
    return !!this.form.get(field)?.hasError(typeError) && !!this.form.get(field)?.touched;
}
// si el field tiene un error por ejemplo de requiereds o fue tocado y no se escribe nada da error en el form.



}
