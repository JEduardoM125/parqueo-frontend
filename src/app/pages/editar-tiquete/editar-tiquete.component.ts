import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IParqueo } from '../../models/parqueo.model';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-editar-tiquete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-tiquete.component.html',
  styleUrl: './editar-tiquete.component.css'
})
export class EditarTiqueteComponent implements OnInit {

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute); //a través de parámetros en la URL SE OBTIENE EL ID
  private tiqueteId!: number; // guardamos el id

  private _formBuilder = inject(FormBuilder); 

  form!: FormGroup;
  

  parqueoList: IParqueo[] = [];
//Dentro de ngOnInit() estás creando el formulario reactivo usando FormBuilder


  ngOnInit(): void {
    // Obtenemos el id de la URL
  this.tiqueteId = Number(this._route.snapshot.paramMap.get('id')); //accede al parámetro de ruta llamado id 

  /*_route es una instancia de ActivatedRoute que Angular inyecta en el componente. Permite acceder a la información de la ruta actual, incluyendo:

parámetros (:id, :name, etc.),
parámetros de consulta (query params),
datos resueltos (resolvers),
hijos, etc.
snapshot es una captura estática del estado de la ruta en el momento en que se carga el componente. Si el parámetro cambia dinámicamente y el componente no se destruye, snapshot no lo detectará.
paramMap es un mapa (similar a un diccionario) que contiene los parámetros de la ruta, definidos como :id
.get('id') obtiene el valor del parámetro id, que es un string. Usualmente lo convertimos a número con Number(...) o parseInt(...) si esperamos un ID numérico.
*/

    this.form = this._formBuilder.group({ 
      placaVehiculo: ['', [Validators.required]], 
      clienteId: [null, [Validators.required]],
      parqueoId: [null, [Validators.required]],
      horaEntrada: [this.getCurrentDateTimeLocal(), [Validators.required]]
    }); 

    this._apiService.getAllParqueos().subscribe({ 
      next: (data) => this.parqueoList = data,
      error: (err) => console.error('Error al cargar parqueos:', err)
    });

    // Cargar los datos del tiquete a editar
  this._apiService.getTiqueteById(this.tiqueteId).subscribe({ // aqui se llama al tiquete especifico con el id que obtuvimos de ActivatedRoute
    next: (tiquete) => this.form.patchValue(tiquete),
    error: (err) => console.error('Error al cargar tiquete:', err)
  });
  }

  editarTiquete(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      return; 
    }

    const tiqueteData = this.form.value;

  this._apiService.updateTiquete(this.tiqueteId, tiqueteData).subscribe({
    next: () => this._router.navigate(['/dashboard/tiquetes']),
    error: (err) => {
      console.error('Error al editar tiquete:', err);
      alert('Error al editar tiquete: ' + err.error);
    }
  });
  }

  hasErrors(field: string, typeError: string): boolean { 
    return !!this.form.get(field)?.hasError(typeError) && !!this.form.get(field)?.touched; 
  }

  private getCurrentDateTimeLocal(): string {
    const now = new Date(); //Crea un objeto Date con la fecha y hora actuales de tu computadora.
    const offset = now.getTimezoneOffset() * 60000; //getTimezoneOffset() devuelve cuántos minutos hay de diferencia entre UTC (hora universal) y tu hora local.
                                                    //➔ Multiplicamos por 60000 para convertir esos minutos en milisegundos (porque los objetos Date trabajan con milisegundos)
    return new Date(now.getTime() - offset).toISOString().slice(0, 16); // formato 'YYYY-MM-DDTHH:MM'
  }

  goTo():void { // cancelar vuelve a la lista de tiquetes
    this._router.navigate([`/dashboard/tiquetes`]);
  
  }
}
