import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ICliente } from '../models/client.model';
import { ITiquete } from '../models/tiquete.model';
import { IParqueo } from '../models/parqueo.model';
import { DashboardResumen } from '../models/dashboardResumen.model';
import { ApiResponse, ResetPasswordResponse } from '../models/ApiResponse.model';

import { environment } from '../../environments/environment'; //  Usa la URL configurada

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 

  private _http = inject(HttpClient);
  private _urlBase: string = environment.apiUrl; // 👈 Usa la variable de entorno


login(username: string, password: string): Observable<any> {
    return this._http.post(`${this._urlBase}/auth/login`, { username, password });
  }
// Para empleados (público)
  registerEmployee(data:any): Observable<any> {
    return this._http.post(`${this._urlBase}/auth/register/employee`, data);
  }
// Para administradores (protegido) // Usamos autenticación basada en JWT con el esquema Bearer
  registerAdmin(data: any): Observable<any> {
  const token = localStorage.getItem('authToken'); // Obtén el token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}` // Agrega el header de autorización
  }); //Bearer <token> es un estándar para autenticación en API
  //La palabra Bearer indica al servidor qué tipo de autenticación se está usando
  //y el token es el valor que se envía para autenticar al usuario.
  //El token es un string que representa la identidad del usuario y sus permisos
//El servidor busca específicamente este header para validar peticiones protegidas
  return this._http.post(`${this._urlBase}/auth/register/admin`, data, { headers })
    .pipe(
      catchError(error => {
        let errorMsg = 'Error desconocido';
        if (error.error?.error) {
          errorMsg = error.error.error;
        } else if (error.message) {
          errorMsg = error.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

//Email Service
 // Método mejorado para forgotPassword
 forgotPassword(email: string): Observable<any> {
  return this._http.post(`${this._urlBase}/auth/forgot-password`, { email })
    .pipe(
      catchError(error => {
        // Mejor manejo de errores
        let errorMsg = 'Error desconocido';
        if (error.error?.error) {
          errorMsg = error.error.error;
        } else if (error.message) {
          errorMsg = error.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
}

resetPassword(token: string, newPassword: string): Observable<ApiResponse<ResetPasswordResponse>> {
  return this._http.post<ApiResponse<ResetPasswordResponse>>(`${this._urlBase}/auth/reset-password`, { 
    token, 
    newPassword 
  }).pipe(
    catchError(error => {
      console.error('Error en el servicio de restablecimiento de contraseña:', error);

      // Mejor manejo de errores
      let errorMessage = 'Error desconocido al restablecer la contraseña';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return throwError(() => ({
        success: false,
        error: errorMessage,
        message: errorMessage
      }));
    })
  );
}





validateResetToken(token: string): Observable<any> {
  return this._http.get(`${this._urlBase}/auth/validate-reset-token`, { params: { token } });
}


  //Dashboard
  getResumen(): Observable<DashboardResumen> {
    return this._http.get<DashboardResumen>(`${this._urlBase}/dashboard/resumen`)
  }

//Clientes
  getAllClients(): Observable<ICliente[]> {
    return this._http.get<ICliente[]>(`${this._urlBase}/cliente`);
  }
  createCliente(cliente: ICliente): Observable<any>{
    return this._http.post<ICliente[]>(`${this._urlBase}/cliente`, cliente);

  }

  //Tiquetes
  getAllTiquetes(): Observable<ITiquete[]>{
    return this._http.get<ITiquete[]>(`${this._urlBase}/tiquete`);
  }

  createTiquete(tiquete: ITiquete):Observable<ITiquete[]> {
    return this._http.post<ITiquete[]>(`${this._urlBase}/tiquete`, tiquete);
  }

  getTiqueteById(id: number): Observable<ITiquete> {
    return this._http.get<any>(`${this._urlBase}/tiquete/${id}`);
  }
  
  updateTiquete(id: number, tiquete: ITiquete) {
    return this._http.put(`${this._urlBase}/tiquete/${id}`, tiquete);
  }

 getResumenCierre(id: number): Observable<any>{
  return this._http.get<any>(`${this._urlBase}/tiquete/cerrar/resumen/${id}`);
 }

 cerrarTiquete(id: number): Observable<any> {
  return this._http.post<any>(`${this._urlBase}/tiquete/cerrar/${id}`, null);
}

  //Parqueos

  getAllParqueos(): Observable<IParqueo[]> {
    return this._http.get<IParqueo[]>(`${this._urlBase}/parqueo`);
  }
  createParqueo(parqueo: IParqueo):Observable<IParqueo[]> {
    return this._http.post<IParqueo[]>(`${this._urlBase}/parqueo`, parqueo);
  }
  getParqueoById(id: number): Observable<IParqueo> {
    return this._http.get<IParqueo>(`${this._urlBase}/parqueo/${id}`);
  }
  updateParqueo(id: number, parqueo: IParqueo) {
    return this._http.put(`${this._urlBase}/parqueo/${id}`, parqueo);
  }
  deleteParqueo(id: number): Observable<any> {
    return this._http.delete(`${this._urlBase}/parqueo/${id}`);
  }
  
  //Reporte Ventas

  obtenerVentasDia(){
    return this._http.get<any[]>(`${this._urlBase}/ReporteTiquete/ventas-hoy`);
  }

  obtenerVentasMes(mes: number, anio: number){
    return this._http.get<any[]>(`${this._urlBase}/ReporteTiquete/ventas-mes/${mes}/${anio}`);
  }
  
  obtenerVentasRango(startDate: string, endDate: string){
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this._http.get<any[]>(`${this._urlBase}/ReporteTiquete/ventas-rango/`, { params });

  }

  obtenerVentasParqueo(parqueoId: number, mes: number, anio: number){
    return this._http.get<any[]>(`${this._urlBase}/ReporteTiquete/ventas-parqueo/${parqueoId}/${mes}/${anio}`);
  }

}
