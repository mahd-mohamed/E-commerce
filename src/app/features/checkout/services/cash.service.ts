import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  };

  processCashPayment(cartId: string, shippingAddress: any): Observable<any> {
    const orderData = {
      shippingAddress,
      paymentMethodType: 'cash'
    };
    
    return this.httpClient.post(`${environment.apiUrl}/orders/${cartId}`, orderData, this.myHeaders);
  }
}
