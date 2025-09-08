import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';;
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!cookieService.get('token')) {
    return router.createUrlTree(['/login']);
  }

  return authService.verifyToken().pipe(
    map((): boolean => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
