import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)
  // BehaviorSubjects to hold cart state across the app
  private readonly cartCountSubject = new BehaviorSubject<number>(0)
  readonly cartCount$ = this.cartCountSubject.asObservable()

  private readonly cartStateSubject = new BehaviorSubject<any | null>(null)
  readonly cartState$ = this.cartStateSubject.asObservable()

  myHeaders:object = {
     
    headers:
    {
      token: this.cookieService.get('token') 

    }
  }
  private setCartState(response: any): void {
    // Normalize and push new cart state and count
    const cartData = response?.data || null
    this.cartStateSubject.next(cartData)
    const count = cartData?.products?.length || 0
    this.cartCountSubject.next(count)
  }

  // Public API to refresh cart from server and emit state
  refreshCart(): void {
    this.getLoggedUserCart().subscribe({
      next: (res) => this.setCartState(res),
      error: () => {
        // In case of error (e.g., not logged in), reset state
        this.cartStateSubject.next(null)
        this.cartCountSubject.next(0)
      }
    })
  }
  addProductToCart(id:string):Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/cart',
    {
      productId: id,
    },
    this.myHeaders
 
    ).pipe(tap((res) => this.setCartState(res)))}
    getLoggedUserCart():Observable<any>{
      return this.httpClient.get(environment.apiUrl + '/cart' , 
        this.myHeaders

      ).pipe(tap((res) => this.setCartState(res)))
    }

    updateCartProductQuantity(productId: string, count: number): Observable<any> {
      return this.httpClient.put(
        environment.apiUrl + `/cart/${productId}`,
        { count },
        this.myHeaders
      ).pipe(tap((res) => this.setCartState(res)))
    }

    removeCartItem(productId: string): Observable<any> {
      return this.httpClient.delete(
        environment.apiUrl + `/cart/${productId}`,
        this.myHeaders
      ).pipe(tap((res) => this.setCartState(res)))
    }

    clearCart(): Observable<any> {
      return this.httpClient.delete(
        environment.apiUrl + '/cart',
        this.myHeaders
      ).pipe(tap((res) => this.setCartState(res)))
    }

  }
