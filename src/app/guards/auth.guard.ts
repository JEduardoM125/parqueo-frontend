import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar autenticación
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtener rol y ruta actual
  const userRole = authService.getRole();
  const currentUrl = state.url;

  // 3. Definir rutas permitidas para cada rol
  const employeeAllowedRoutes = [
    '/dashboard/inicio',
    '/dashboard/tiquetes',
    '/dashboard/tiquetes/crear',
    '/dashboard/tiquetes/editar',
    '/dashboard/tiquetes/cerrar',
    '/dashboard/clientes',
    '/dashboard/clientes/crear',
    '/dashboard/parqueos',
    '/dashboard/parqueo/crear',
    '/dashboard/parqueo/editar'
  ];

  const adminAllowedRoutes = [
    '/dashboard/empleados',
    '/dashboard/reporte-tiquetes',
    '/dashboard/reporte-ventas',
    '/dashboard/analytics'
  ];

  // 4. Lógica de permisos
  if (userRole === 'Employee' && !employeeAllowedRoutes.some(route => currentUrl.startsWith(route))) {
    router.navigate(['/dashboard/inicio']);
    return false;
  }

  // Los admins tienen acceso a todo
  if (userRole === 'Admin') {
    return true;
  }

  return true;
};
