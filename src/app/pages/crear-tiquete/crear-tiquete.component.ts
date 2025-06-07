import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IParqueo } from '../../models/parqueo.model';
import { CommonModule, NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-crear-tiquete',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './crear-tiquete.component.html',
  styleUrl: './crear-tiquete.component.css'
})
export class CrearTiqueteComponent implements OnInit {
  
  private _apiService = inject(ApiService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder); //para construir el formulario de forma reactiva.

  form!: FormGroup;
  //form es una variable que representa todo el formulario.
  //FormGroup significa que form será un grupo de campos (como un objeto que contiene controles).
//El signo ! (form!) le dice a TypeScript: que esta variable se va a inicializar antes de usarse, porque form realmente se crea después, en el ngOnInit()

  parqueoList: IParqueo[] = [];
//Dentro de ngOnInit() estás creando el formulario reactivo usando FormBuilder


  ngOnInit(): void {// se ejecuta cuando se cargaa el componente con OnInit y se construye con 4 campos
    this.form = this._formBuilder.group({ //esto es lo que crea el formualrio, esta linea, Cada llave es un campo (input) del formulario, con su valor inicial y sus validaciones
      placaVehiculo: ['', [Validators.required]], //Obliga al usuario a llenar ese campo. Si el campo está vacío ➔ el formulario queda inválido.
      clienteId: [null, [Validators.required]],
      parqueoId: [null, [Validators.required]],
      horaEntrada: [this.getCurrentDateTimeLocal(), [Validators.required]]
    }); // '' El input empieza vacío, null  	El input empieza sin valor (nulo)., his.getCurrentDateTimeLocal()	Se le asigna la hora actual al input en formato 'YYYY-MM-DDTHH:MM'.

    this._apiService.getAllParqueos().subscribe({ // y se llama a la api/parqueos para cargara la lista de parqueos y mostrar nombres en el select
      next: (data) => this.parqueoList = data,
      error: (err) => console.error('Error al cargar parqueos:', err)
    });
  }

  crearTiquete(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // cuando el suuario da submit pero no lleno nada entonces se muestran mensaje de error, aunque no se haya interactuado  con los inputs por eso se usa markallastouched
      return; //asi el usuario no tiene que adviniar que tiene que llenar
    }

    this._apiService.createTiquete(this.form.value).subscribe({ //si los inputs sse llenan y es valido se llama a la api
      next: () => this._router.navigate(['/dashboard/tiquetes']), // luego al crear el tiquete nos redirije al dashboard de tiquetes
      error: (err) => {
        console.error('Error al crear tiquete:', err);
        alert('Error al crear tiquete: ' + err.error);
      }
    });
  }

  hasErrors(field: string, typeError: string): boolean { //Devuelve true si un campo específico tiene un tipo de error y el campo fue tocado.
    return !!this.form.get(field)?.hasError(typeError) && !!this.form.get(field)?.touched; // se usa en el html para mostrar mensajes de error
    
  }
/*field: string: el nombre del campo del formulario que quieres revisar (por ejemplo "placaVehiculo").
typeError: string: el tipo de error que quieres verificar (por ejemplo "required"). 
this.form.get(field) obtiene el control del formulario con el nombre de input q ue pasaste arriba (placaVehiculo, clienteId, etc.).
?.hasError(typeError) Pregunta si ese campo tiene un error específico (por ejemplo, si falta el valor requerido).
&& this.form.get(field)?.touched: Además, pregunta si el campo ya fue tocado (si el usuario hizo clic o escribió algo en el campo).
!! (doble negación): convierte lo que salga en un booleano estricto (true o false).

¿El campo tiene el error que busco?

¿El usuario ya tocó ese campo?

Si sí a las dos ➔ devuelve true y el mensaje de error aparece.



ngClass para el html se usa ya que es una directiva de Angular que agrega o quita clases CSS dinámicamente en un elemento HTML dependiendo de una condición.
Es como decir:
Si pasa algo ➔ pon esta clase; si no pasa ➔ no la pongas. Entinces en el html  [ngClass]="{ 'is-invalid': hasErrors('placaVehiculo', 'required') }"
[ngClass] espera un objeto {}.
Ese objeto dice:
"is-invalid" ➔ aplíque la clase is-invalid si hasErrors('placaVehiculo', 'required') es true.
Entonces el metodo has errors revisa si el campo "placaVehiculo" tiene error de required y si el usuario ya lo tocó.
Si el input está vacío y el usuario ya tocó el campo, entinces has errors seria true por ende:
➔ El input se le pone la clase "is-invalid".

La clase "is-invalid" normalmente viene de Bootstrap o de tu propio CSS y pinta el borde rojo alrededor del input para indicar que tiene un error

*/

  private getCurrentDateTimeLocal(): string {
    const now = new Date(); //Crea un objeto Date con la fecha y hora actuales de tu computadora.
    const offset = now.getTimezoneOffset() * 60000; //getTimezoneOffset() devuelve cuántos minutos hay de diferencia entre UTC (hora universal) y tu hora local.
                                                    //➔ Multiplicamos por 60000 para convertir esos minutos en milisegundos (porque los objetos Date trabajan con milisegundos)
    return new Date(now.getTime() - offset).toISOString().slice(0, 16); // formato 'YYYY-MM-DDTHH:MM'
  } //Ajustamos la fecha y hora a la hora local sin desfasaje. ➔ now.getTime() da el tiempo en milisegundos; luego le restamos el offset.
//toISOString() convierte la fecha en formato ISO 8601 (ej: 2025-04-25T21:30:00.000Z). ➔ slice(0, 16) recorta la cadena para dejar solo la parte de YYYY-MM-DDTHH:MM
//(sin los segundos ni los milisegundos).


goTo():void { // cancelar vuelve a la lista de tiquetes
  this._router.navigate([`/dashboard/tiquetes`]);

}
}
