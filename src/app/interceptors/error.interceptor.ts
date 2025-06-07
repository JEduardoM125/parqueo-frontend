import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../core/services/notification.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      let errorMessage = '';
      
      if (error.status === 401) {
        router.navigate(['/login']);
        errorMessage = 'Sesión expirada';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor';
      } else {
        errorMessage = error.error?.message || error.message || 'Error desconocido';
      }

      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};