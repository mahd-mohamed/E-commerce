import { HttpClient } from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  };

  addProductToWishlist(id: string): Observable<any> {
  return this.httpClient.post(
    environment.apiUrl + '/wishlist',
    { productId: id },
    this.myHeaders
  );
}


  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(
      environment.apiUrl + '/wishlist',
      this.myHeaders
    );
  }

  removeWishlistItem(productId: string): Observable<any> {
    return this.httpClient.delete(
      environment.apiUrl + `/wishlist/${productId}`,
      this.myHeaders
    );
  }
}




