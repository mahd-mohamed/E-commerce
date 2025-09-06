import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)
  myHeaders:object = {
     
    headers:
    {
      token: this.cookieService.get('token') 

    }
  }
  addProductToCart(id:string):Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/cart',
    {
      productId: id,
    },
    this.myHeaders
 
    )}
    getLoggedUserCart():Observable<any>{
      return this.httpClient.get(environment.apiUrl + '/cart' , 
        this.myHeaders

      )
    }

    updateCartProductQuantity(productId: string, count: number): Observable<any> {
      return this.httpClient.put(
        environment.apiUrl + `/cart/${productId}`,
        { count },
        this.myHeaders
      )
    }

    removeCartItem(productId: string): Observable<any> {
      return this.httpClient.delete(
        environment.apiUrl + `/cart/${productId}`,
        this.myHeaders
      )
    }

    clearCart(): Observable<any> {
      return this.httpClient.delete(
        environment.apiUrl + '/cart',
        this.myHeaders
      )
    }

  }
