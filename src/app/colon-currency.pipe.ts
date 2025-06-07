import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colonCurrency'
})
export class ColonCurrencyPipe implements PipeTransform {

  transform(value: number): string {
    if(value==null) return '₡0';
    return '₡' + value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } // minimumFractionDigits y maximumFractionDigits son para mostrar siempre dos decimales
  // y el separador de miles es la coma (,) en español de Costa Rica
  

}
