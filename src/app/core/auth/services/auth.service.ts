import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)
  private readonly router = inject(Router)
  registerForm(data:object):Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/auth/signup',data)
  }
   loginForm(data:object):Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/auth/signin',data)
  }
  logout():void{
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
   
  }
  decodeToken(){
    let token;
    try{
         token = jwtDecode(this.cookieService.get('token'));


    }
    catch(error){
      this.logout();
  }
    return token;
  }
  sendResetCode(data:object):Observable<any>{
    return this.httpClient.post(environment.apiUrl +'/auth/forgotPasswords', data )

  }
  verifyResetCode(data:object):Observable<any>{
    return this.httpClient.post(environment.apiUrl +'/auth/verifyResetCode', data )

  }
   resetUserPassword(data:object):Observable<any>{
    return this.httpClient.put(environment.apiUrl +'/auth/resetPassword', data )

  }
  //  
  //  
  
}
