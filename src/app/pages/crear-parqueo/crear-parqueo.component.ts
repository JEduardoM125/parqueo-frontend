import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-parqueo',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './crear-parqueo.component.html',
  styleUrl: './crear-parqueo.component.css'
})
export class CrearParqueoComponent implements OnInit {

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this._formBuilder.group({ //esto es lo que crea el formualrio, esta linea, Cada llave es un campo (input) del formulario, con su valor inicial y sus validaciones
      nombre: ['', Validators.required],
      cantidadMaximaVehiculos: [null, Validators.required],
      horaApertura: [this.getCurrentTime(), Validators.required],
      horaCierre: [this.getCurrentTime(), Validators.required],
      tarifaPorHora: [null, Validators.required],
      tarifaPorMediaHora: [null, Validators.required],
    }); 

  }

  private getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; // devuelve "14:07"
  }


  private ensureFullTimeFormat(time: string): string {
    return time.length === 5 ? `${time}:00` : time; // ej: "06:00" → "06:00:00"
  }


  crearParqueo(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // cuando el suuario da submit pero no lleno nada entonces se muestran mensaje de error, aunque no se haya interactuado  con los inputs por eso se usa markallastouched
      return; //asi el usuario no tiene que adviniar que tiene que llenar
    }
    const formData = {
      ...this.form.value,
      horaApertura: this.ensureFullTimeFormat(this.form.value.horaApertura),
      horaCierre: this.ensureFullTimeFormat(this.form.value.horaCierre)
    };

  

    this._apiService.createParqueo(formData).subscribe({ //si los inputs sse llenan y es valido se llama a la api
      next: () => this._router.navigate(['/dashboard/parqueos']), // luego al crear el tiquete nos redirije al dashboard de tiquetes
      error: (err) => {
        console.error('Error al crear parqueo:', err);
        alert('Error al crear parqueo: ' + err.error);
      }
    });
  }


  // Removed duplicate implementation of getCurrentTime

  hasErrors(field: string, typeError: string): boolean { //Devuelve true si un campo específico tiene un tipo de error y el campo fue tocado.
    return !!this.form.get(field)?.hasError(typeError) && !!this.form.get(field)?.touched; // se usa en el html para mostrar mensajes de error
    
  }

  goTo():void { // cancelar vuelve a la lista de parqueos
    this._router.navigate([`/dashboard/parqueos`]);
  
  }
}
