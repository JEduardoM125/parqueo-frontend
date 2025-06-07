import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IParqueo } from '../../models/parqueo.model';
import { ColonCurrencyPipe } from '../../colon-currency.pipe';


@Component({
  selector: 'app-reporte-tiquetes',
  imports: [CommonModule, FormsModule, ColonCurrencyPipe],
  templateUrl: './reporte-tiquetes.component.html',
  styleUrl: './reporte-tiquetes.component.css'
})
export class ReporteTiquetesComponent {
 
 private _apiService = inject(ApiService);

  //Parametros para filtro de reporte 
//
 tipoReporte = signal(''); // Es una función reactiva que crea una fuente de datos reactiva, La vista se actualiza automáticamente cuando el modelo cambia
  mes = signal<number | null>(null); // Inicializa el mes como null, una vez que se seleccione un mes, 
  // se actualizará el valor como number por ejemplo 1 para enero, 2 para febrero, etc.
  // Se usa un número para representar el mes, y se inicializa como null

  anio = signal<number | null>(null);
  startDate = signal<string>('');
  endDate = signal<string>(''); // Inicializa el rango de fechas como vacío
  parqueoId = signal<number | null>(null);

  //Lista de reportes
  // Se inicializa como un array vacío, y se actualizará con los datos obtenidos del API
  reportes = signal<any[]>([]);
  cargando = signal(false);

  // Meses para el select de mes
  // Se usa un array de objetos para almacenar el valor y el nombre del mes
  //se usa directiva for El @for crea un <option> para cada mes, ejemplo: @for (m of meses; track m.valor) {
                                                                        /*<option [value]="m.valor">{{ m.nombre }}</option>}
//Cada opción tiene:[value]="m.valor" → Atributo value del HTML (1 para Enero, 2 para Febrero, etc.)
//{{ m.nombre }} → Texto visible (Enero, Febrero, etc.)*/

//Entonces si seleciono mayo, el valor de mes será 5 y el nombre será 'Mayo'.
//El valor se usa para enviar al API y el nombre para mostrar en el select
//El valor 5 se pasa como $event a mes.set($event)
// y esto actualiza el signal mes() de null a 5

//

meses = [
  { valor: 1, nombre: 'Enero' },
  { valor: 2, nombre: 'Febrero' },
  { valor: 3, nombre: 'Marzo' },
  { valor: 4, nombre: 'Abril' },
  { valor: 5, nombre: 'Mayo' },
  { valor: 6, nombre: 'Junio' },
  { valor: 7, nombre: 'Julio' },
  { valor: 8, nombre: 'Agosto' },
  { valor: 9, nombre: 'Setiembre' },
  { valor: 10, nombre: 'Octubre' },
  { valor: 11, nombre: 'Noviembre' },
  { valor: 12, nombre: 'Diciembre' }
];

// Genera años (por ejemplo, desde 2020 hasta el año actual + 1) para el select de año
  // Se usa un array de objetos para almacenar el valor y el nombre del año
  // _, i son variables que no se usan, pero son necesarias para el método Array.from
anios = Array.from({length: new Date().getFullYear() - 2019}, (_, i) => 2020 + i);

  tipos = [ // Opciones para el select de tipo de reporte
    { valor: 'dia', texto: 'Ventas del Día' },
    { valor: 'mes', texto: 'Ventas por Mes' },
    { valor: 'rango', texto: 'Ventas en Rango' },
    { valor: 'parqueo', texto: 'Ventas por Parqueo' }
  ];

  // Lista de parqueos para el select. Se usa una señal para la reactividad.
  parqueoList = signal<IParqueo[]>([]);

  // En el constructor o ngOnInit, carga la lista de parqueos
  constructor() {
    // Cargar lista de parqueos; asumo que tu ApiService tiene el método getAllParqueos()
    this._apiService.getAllParqueos().toPromise()
      .then(data => {
        if (data) {
          this.parqueoList.set(data);
        } else {
          console.error('Error: Received undefined data for parqueoList');
        }
      })
      .catch(err => console.error('Error al cargar parqueos:', err));
  }

  async obtenerReporte() {
    this.cargando.set(true);

    try {
      let datos: any[] = [];

      switch (this.tipoReporte()) {
        case 'dia':
          datos = (await this._apiService.obtenerVentasDia().toPromise()) || [];
          break;
        case 'mes':
          datos = (await this._apiService.obtenerVentasMes(this.mes()!, this.anio()!).toPromise()) || [];
          break;
        case 'rango':
          datos = (await this._apiService.obtenerVentasRango(this.startDate(), this.endDate()).toPromise()) || [];
          break;
        case 'parqueo':
          datos = (await this._apiService.obtenerVentasParqueo(this.parqueoId()!, this.mes()!, this.anio()!).toPromise()) || [];
          break;
      }

      this.reportes.set(datos);
    } catch (error) {
      console.error('Error al obtener reporte:', error);
      this.reportes.set([]);
    } finally {
      this.cargando.set(false);
    }
  }



 
}
