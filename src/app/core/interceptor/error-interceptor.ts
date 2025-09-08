import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  return next(req).pipe(
    catchError(err => {
      // Auto-redirect on unauthorized/forbidden
      if (err?.status === 401 || err?.status === 403) {
        cookieService.delete('token');
        router.navigateByUrl('/login');
        // Optional: avoid duplicate noisy toasts on auth failures
      } else {
        toastService.error(err.error?.message || 'Something went wrong');
      }
      return throwError(() => err);
    })
  );
};
