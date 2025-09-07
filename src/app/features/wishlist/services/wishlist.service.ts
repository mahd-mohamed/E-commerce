import { HttpClient } from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  // BehaviorSubjects to hold wishlist state across the app
  private readonly wishlistCountSubject = new BehaviorSubject<number>(0)
  readonly wishlistCount$ = this.wishlistCountSubject.asObservable()
  
  // Getter for current count value
  get currentWishlistCount(): number {
    return this.wishlistCountSubject.value;
  }

  private readonly wishlistStateSubject = new BehaviorSubject<any | null>(null)
  readonly wishlistState$ = this.wishlistStateSubject.asObservable()


  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  };

  private setWishlistState(response: any): void {
    // Normalize and push new wishlist state and count
    const wishlistData = response?.data || null
    this.wishlistStateSubject.next(wishlistData)
    // Use response.count if available, otherwise use data array length
    const count = response?.count || (wishlistData?.length || 0)
    this.wishlistCountSubject.next(count)
  }

  // Public API to refresh wishlist from server and emit state
  refreshWishlist(): void {
    this.getLoggedUserWishlist().subscribe({
      next: (res) => this.setWishlistState(res),
      error: (err) => {
        // In case of error (e.g., not logged in), reset state
        this.wishlistStateSubject.next(null)
        this.wishlistCountSubject.next(0)
      }
    })
  }

  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(
      environment.apiUrl + '/wishlist',
      { productId: id },
      this.myHeaders
    ).pipe(tap((res) => this.setWishlistState(res)))
  }


  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(
      environment.apiUrl + '/wishlist',
      this.myHeaders
    ).pipe(tap((res) => this.setWishlistState(res)))
  }

  removeWishlistItem(productId: string): Observable<any> {
    return this.httpClient.delete(
      environment.apiUrl + `/wishlist/${productId}`,
      this.myHeaders
    ).pipe(tap((res) => this.setWishlistState(res)))
  }
}




