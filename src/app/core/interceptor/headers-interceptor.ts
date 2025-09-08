import { CookieService } from 'ngx-cookie-service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService)
  //req
 if(cookieService.check('token')){
  
    req = req.clone({
    setHeaders:{
      token:cookieService.get('token'),
    },
});

 }

  return next(req);//res
};
