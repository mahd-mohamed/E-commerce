import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit, OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly cookieService = inject(CookieService);
  
  @Input() product: Product = {} as Product;
  
  isInWishlist: boolean = false;

  ngOnInit(): void {
   
    // Check initial state from current wishlist
    this.checkInitialWishlistState();
     // Load wishlist data if user is logged in
    const token = this.cookieService.get('token');
    if (token) {
      this.wishlistService.refreshWishlist();
    }
  }

  private checkInitialWishlistState(): void {
    // Get current wishlist state synchronously
    const currentWishlist = this.wishlistService.currentWishlistState;
    this.checkIfInWishlist(currentWishlist);
  }

  ngOnDestroy(): void {
    // No subscriptions to clean up
  }

  private checkIfInWishlist(wishlistData: any): void {
    if (wishlistData && Array.isArray(wishlistData)) {
      this.isInWishlist = wishlistData.some((item: any) => item._id === this.product._id);
    } else {
      this.isInWishlist = false;
    }
  }

  getDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (!originalPrice || !discountedPrice) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }

  addToCart(id: string, event: Event): void {
    // Prevent event propagation to avoid triggering the card's routerLink
    event.stopPropagation();
    this.cartService.addProductToCart(id).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        this.toastService.success('Product added to cart successfully!');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        this.toastService.error('Failed to add product to cart. Please try again.');
      }
    });
  }
toggleWishlist(id: string, event: Event): void {
  event.stopPropagation();
  
  if (this.isInWishlist) {
    // Remove from wishlist
    this.wishlistService.removeWishlistItem(id).subscribe({
      next: (response) => {
        console.log('Product removed from wishlist:', response);
        this.toastService.success('Product removed from wishlist!');
        // Update local state immediately
        this.isInWishlist = false;
        // The wishlist service will automatically update the count via the tap operator
      },
      error: (error) => {
        console.error('Error removing product from wishlist:', error);
        this.toastService.error('Failed to remove product from wishlist. Please try again.');
      }
    });
  } else {
    // Add to wishlist
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (response) => {
        console.log('Product added to wishlist:', response);
        this.toastService.success('Product added to wishlist successfully!');
        // Update local state immediately
        this.isInWishlist = true;
        // The wishlist service will automatically update the count via the tap operator
      },
      error: (error) => {
        console.error('Error adding product to wishlist:', error);
        this.toastService.error('Failed to add product to wishlist. Please try again.');
      }
    });
  }
}



}
