import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IParqueo } from '../../models/parqueo.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';


@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  private _apiService = inject(ApiService);

  // Señales reactivas
  tipoReporte = signal('dia'); //tipoReporte es una reactive signal inicializada con el valor 'dia'.
  mes = signal<number | null>(new Date().getMonth() + 1);
  anio = signal<number | null>(new Date().getFullYear());
  startDate = signal<string>('');
  endDate = signal<string>('');
  parqueoId = signal<number | null>(null);

  // Datos y estado
  chartData = signal<any[]>([]); // Lista de datos para el gráfico. Lista de datasets que se grafican.
  chartLabels = signal<string[]>([]); // Etiquetas para el gráfico. 	Eje X (fechas, horas, parqueos, etc.).
  loading = signal(false); // Estado de carga
  chartType = signal<'bar' | 'line' | 'pie'>('bar'); // Tipo de gráfico (bar, line, pie)

  // Opciones para selects (igual que antes)
  // Opciones para selects
  meses = [
    { valor: 1, nombre: 'Enero' }, // Meses del año
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

  anios = Array.from({length: new Date().getFullYear() - 2019}, (_, i) => 2020 + i); // Años desde 2020 hasta el año actual

  tiposReporte = [ // Tipos de reportes
    { valor: 'dia', texto: 'Ventas del Día' },
    { valor: 'mes', texto: 'Ventas por Mes' },
    { valor: 'rango', texto: 'Ventas en Rango' },
    { valor: 'parqueo', texto: 'Ventas por Parqueo' }
  ];

  parqueoList = signal<IParqueo[]>([]); // Lista de parqueos

  chartOptions: ChartOptions = { // Opciones del gráfico
    responsive: true, // Hacer el gráfico responsivo
    scales: {  // Escalas del gráfico
      y: {  // Eje Y
        beginAtZero: true,  // Comenzar en cero
        ticks: {  // Los ticks son las marcas numéricas que aparecen en los ejes del gráfico (por ejemplo, en el eje Y: 0, 500, 1000, etc.). 
          callback: (value: string | number) => { // Formatear los ticks
            if (typeof value === 'number') {
              return '₡' + value.toLocaleString(); //Si el valor es un número, se convierte en formato de moneda con '₡' y separación de miles.Si por alguna razón es un string, simplemente se devuelve como está.
            }                           //.toLocaleString() convierte el número a una cadena con separadores de miles y decimales según la configuración regional del navegador. 1000 => "1,000" 
            return value;
          }
        }
      }
    },
    plugins: { //Chart.js permite añadir funcionalidades extra llamadas plugins, como:
      tooltip: { //información al pasar el mouse, el tooltip es el cuadro que aparece cuando pasas el mouse sobre un punto del gráfico. esta personalizado por el callback
        callbacks: {
          label: (context) => { // context es el objeto que contiene información sobre el tooltip
            // context.dataset es el dataset al que pertenece el punto del gráfico
            let label = context.dataset.label || '';  //context.dataset.label: el nombre del conjunto de datos (ej. "Ventas") si no existe, se deja vacío.
            if (label) label += ': ';  // Si hay una etiqueta, se añade dos puntos y un espacio
            if (typeof context.raw === 'number') { // context.raw es el valor del punto del gráfico // Si es un número, se formatea como moneda
              label += '₡' + context.raw.toLocaleString(); // Se convierte el número a una cadena con separadores de miles y decimales según la configuración regional del navegador.
            } else {
              label += context.raw; // Si no es un número, se añade el valor tal cual, el valor del punto en sí (ej. 4500) // context.raw es el valor del punto del gráfico
            }
            return label; // Devuelve la etiqueta formateada, es decir, "Ventas: ₡1,000" es el formato que se verá en el tooltip.
          }
        }
      }
    }
  };

  constructor() {
    this._apiService.getAllParqueos().subscribe({
      next: (data) => this.parqueoList.set(data),
      error: (err) => console.error('Error al cargar parqueos:', err)
    });
  }

  async obtenerDatos() {
    this.loading.set(true);
    this.chartData.set([]);
    this.chartLabels.set([]);

    try {
      let datos: any[] = [];

      switch (this.tipoReporte()) { // leyendo el valor actual de la signal, que inicialmente es 'dia'. pero si usuario cambia el select, se actualiza automáticamente.
        case 'dia':  //El switch permite que obtenerDatos() reaccione al valor actual de la signal, no solo al valor inicial.
          datos = (await this._apiService.obtenerVentasDia().toPromise()) || [];
          break;
        case 'mes':
          if (!this.mes() || !this.anio()) return;
          datos = (await this._apiService.obtenerVentasMes(this.mes()!, this.anio()!).toPromise()) || [];
          break;
        case 'rango':
          if (!this.startDate() || !this.endDate()) return;
          datos = (await this._apiService.obtenerVentasRango(this.startDate(), this.endDate()).toPromise()) || [];
          break;
        case 'parqueo':
          if (!this.mes() || !this.anio()) return;
          datos = (await this._apiService.obtenerVentasParqueo(this.parqueoId() ?? 0, this.mes()!, this.anio()!).toPromise()) || [];
          break;
      }

      this.prepararDatosParaGraficos(datos);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  prepararDatosParaGraficos(datos: any[]) {
    if (!datos || datos.length === 0) return;

    switch (this.tipoReporte()) {
      case 'dia':
        this.prepararDatosDia(datos);
        break;
      case 'mes':
        this.prepararDatosMes(datos);
        break;
      case 'rango':
        this.prepararDatosRango(datos);
        break;
      case 'parqueo':
        this.prepararDatosParqueo(datos);
        break;
    }
  }

  prepararDatosDia(datos: any[]) {
    // Agrupar por hora del día
    const ventasPorHora = Array(24).fill(0).map((_, i) => ({ hora: i, monto: 0 })); // Arreglo de 24 espacios, cada uno representando una hora del día (0-23) y un monto inicial de 0.
                                                                                    // .fill(0)` → rellena el arreglo con ceros para evitar "huecos". 
                                                                                    // .map recorre el arreglo y crea un nuevo arreglo con objetos que tienen la hora y el monto inicializado a 0.
                                                                                    // map((valor, índice) => { ... }) _ representa el valor actual del array (que es 0, porque hicimos .fill(0))., i representa el índice, o sea, la posición dentro del arreglo (de 0 a 23).
                                                                                  // Por ejemplo, el primer objeto sería { hora: 0, monto: 0 }, el segundo { hora: 1, monto: 0 }, etc.    
                                                                                  //Recorre cada posición con `i` de 0 a 23.
                                                                                // Devuelve un objeto `{ hora: i, monto: 0 }` por cada posición.

    datos.forEach(item => {
      const hora = new Date(item.fechaReporte).getHours(); // Obtener la hora de la fecha del reporte
      ventasPorHora[hora].monto += item.monto; // - Se acumula el monto en la hora correspondiente , Si una venta fue a las 13:00 → suma su monto a `ventasPorHora[13].monto`
    });

    this.chartType.set('line'); //this.chartData.set(...)	Se usa porque chartData es una signal // el graficar es de tipo 'line'
    this.chartLabels.set(ventasPorHora.map(v => `${v.hora}:00`)); // Se usa porque chartLabels es una signal // Se asigna el valor de las horas al eje X
    this.chartData.set([{ 
      data: ventasPorHora.map(v => v.monto),
      label: 'Ventas por hora',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      tension: 0.1
    }]);
  }

  prepararDatosMes(datos: any[]) {
    const diasEnMes = new Date(this.anio()!, this.mes()!, 0).getDate();
    const ventasPorDia = Array(diasEnMes).fill(0).map((_, i) => ({ dia: i + 1, monto: 0 }));
    
    datos.forEach(item => {
      const dia = new Date(item.fechaReporte).getDate();
      if (dia <= diasEnMes) {
        ventasPorDia[dia - 1].monto += item.monto;
      }
    });

    this.chartType.set('bar');
    this.chartLabels.set(ventasPorDia.map(v => `Día ${v.dia}`));
    this.chartData.set([{
      data: ventasPorDia.map(v => v.monto),
      label: 'Ventas por día',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]);
  }

  prepararDatosRango(datos: any[]) {
    // Agrupar por fecha en el rango
    const ventasPorFecha: {[key: string]: number} = {};
    
    datos.forEach(item => {
      const fecha = new Date(item.fechaReporte).toLocaleDateString();
      ventasPorFecha[fecha] = (ventasPorFecha[fecha] || 0) + item.monto;
    });

    const fechasOrdenadas = Object.keys(ventasPorFecha).sort();
    
    this.chartType.set('bar');
    this.chartLabels.set(fechasOrdenadas);
    this.chartData.set([{
      data: fechasOrdenadas.map(f => ventasPorFecha[f]),
      label: 'Ventas por fecha',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]);
  }

  prepararDatosParqueo(datos: any[]) {
    // Agrupar por parqueo si no se seleccionó uno específico
    if (this.parqueoId() === null) {
      const ventasPorParqueo: {[key: number]: {nombre: string, monto: number}} = {};
      
      datos.forEach(item => {
        if (!ventasPorParqueo[item.parqueoId]) {
          const parqueo = this.parqueoList().find(p => p.id === item.parqueoId);
          ventasPorParqueo[item.parqueoId] = {
            nombre: parqueo?.nombre || `Parqueo ${item.parqueoId}`,
            monto: 0
          };
        }
        ventasPorParqueo[item.parqueoId].monto += item.monto;
      });

      this.chartType.set('pie');
      this.chartLabels.set(Object.values(ventasPorParqueo).map(v => v.nombre));
      this.chartData.set([{
        data: Object.values(ventasPorParqueo).map(v => v.monto),
        backgroundColor: this.generateColors(Object.keys(ventasPorParqueo).length)
      }]);
    } else {
      // Si se seleccionó un parqueo específico, mostrar por día como el reporte mensual
      this.prepararDatosMes(datos);
    }
  }

  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360 / count) % 360;
      colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
    }
    return colors;
  }

  calcularTotalVentas(): number {
    if (this.chartData().length === 0) return 0;
    return this.chartData()[0].data.reduce((a: number, b: number) => a + b, 0);
  }

  obtenerHoraPico(): string {
  if (this.chartData().length === 0 || this.tipoReporte() !== 'dia') return 'N/A';
  
  const maxValue = Math.max(...this.chartData()[0].data);
  const horaIndex = this.chartData()[0].data.indexOf(maxValue);
  return `${horaIndex}:00 - ₡${maxValue.toLocaleString()}`;
}

obtenerDiaMaxVentas(): string {
  if (this.chartData().length === 0 || 
      (this.tipoReporte() !== 'mes' && this.tipoReporte() !== 'rango')) return 'N/A';
  
  const maxValue = Math.max(...this.chartData()[0].data);
  const diaIndex = this.chartData()[0].data.indexOf(maxValue);
  const diaLabel = this.chartLabels()[diaIndex];
  return `${diaLabel} - ₡${maxValue.toLocaleString()}`;
}
}