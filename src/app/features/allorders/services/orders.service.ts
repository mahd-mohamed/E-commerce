import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Orders } from '../models/orders.interface';
import { AuthService } from '../../../core/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly authService = inject(AuthService);

  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  };

  getUserOrders(): Observable<Orders[]> {
    const userToken = this.authService.decodeToken() as any;
    const userId = userToken?.id || userToken?._id;
    
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    
    return this.httpClient.get<Orders[]>(`${environment.apiUrl}/orders/user/${userId}`, this.myHeaders);
  }
}
