import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InicioComponent } from './pages/inicio/inicio.component'; // Import InicioComponent
import { ParqueosComponent } from './pages/parqueos/parqueos.component';
import { TiquetesComponent } from './pages/tiquetes/tiquetes.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { ReporteTiquetesComponent } from './pages/reporte-tiquetes/reporte-tiquetes.component';

import { authGuard } from './guards/auth.guard'; // Import AuthGuard for route protection
import { CrearTiqueteComponent } from './pages/crear-tiquete/crear-tiquete.component';
import { CrearClienteComponent } from './pages/crear-cliente/crear-cliente.component';
import { EditarTiqueteComponent } from './pages/editar-tiquete/editar-tiquete.component';
import { CerrarTiqueteComponent } from './pages/cerrar-tiquete/cerrar-tiquete.component';
import { CrearParqueoComponent } from './pages/crear-parqueo/crear-parqueo.component';
import { EditarParqueoComponent } from './pages/editar-parqueo/editar-parqueo.component';
import { RequestResetComponent } from './pages/request-reset/request-reset.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { RegisterEmployeeComponent } from './pages/register-employee/register-employee.component'; // Import RegisterEmployeeComponent
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';



export const routes: Routes = [
    { path: '', component: LoginComponent }, // Default route to login page
  { path: 'login', component: LoginComponent },
  {path: 'register-employee', component: RegisterEmployeeComponent}, // Placeholder for register-employee route
  {path: 'request-reset', component: RequestResetComponent}, // Placeholder for request-reset route
  {path: 'reset-password', component: ResetPasswordComponent}, // Placeholder for reset-password route

  //Rutas hijas dentro del dashboard

  {
    path: 'dashboard',
    canActivate: [authGuard], // Protect the dashboard route with AuthGuard
    canActivateChild: [authGuard], // Uncomment if you want to protect child routes as well
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio', pathMatch: 'full' 
      },
      { path: 'inicio', 
        component: InicioComponent },
        {
          path: 'register-admin',
          component: RegisterAdminComponent // Route to RegisterAdminComponent
        },
      {
        path: 'parqueos',
        component: ParqueosComponent // Route to ParqueosComponent
      },
      {
        path: 'parqueo/crear',
        component: CrearParqueoComponent
      },
      {
        path: 'parqueo/editar/:id',
        component: EditarParqueoComponent
      },
     

      {
        path: 'tiquetes',
        component: TiquetesComponent, // Route to TiquetesComponent
      },
      {
        path: 'tiquetes/crear',
        component: CrearTiqueteComponent
      },
      {
        path: 'tiquetes/editar/:id',
        component: EditarTiqueteComponent
      },
      {
        path: 'tiquetes/cerrar/:id',
        component: CerrarTiqueteComponent
      },

      {
        path: 'clientes',
        component: ClientesComponent // Route to ClientesComponent
      },
      {
        path: 'clientes/crear',
        component: CrearClienteComponent
      },
      {
        path: 'empleados',
        component: EmpleadosComponent // Route to EmpleadosComponent
      },
      {
        path: 'reporte-tiquetes',
        component: ReporteTiquetesComponent // Route to ReporteTiquetesComponent
      },
      
      {
        path: 'analytics',
        component: AnalyticsComponent // Route to ReporteVentasComponent
      }
    ]
  },
  //catchAll para redirigir a la página de inicio si no se encuentra la ruta
  {path: '**', redirectTo: '', pathMatch: 'full'}
  
];
