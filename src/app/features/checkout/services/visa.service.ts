import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VisaService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  };

  processVisaPayment(cartId: string, shippingAddress: any): Observable<any> {
    const orderData = {
      shippingAddress,
      paymentMethodType: 'card'
    };
    
    // return this.httpClient.post(`${environment.apiUrl}/orders/checkout-session/${cartId}?url=http://localhost:4200`, orderData, this.myHeaders);
return this.httpClient.post(
  `${environment.apiUrl}/orders/checkout-session/${cartId}?url=https://mahdecommerce.vercel.app`,
  orderData,
  this.myHeaders
);

  }
}
