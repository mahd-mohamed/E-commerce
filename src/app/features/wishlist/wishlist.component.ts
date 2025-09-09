import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from './services/wishlist.service';
import { Wishlist, Daum } from './models/wishlist.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly cartService = inject(CartService);

  wishlistDetails: Daum[] = [];
  loading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.getLoggedUserData();
  }

  getLoggedUserData() {
    this.loading = true;
    this.error = '';

    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (response) => {
        this.wishlistDetails = response.data || [];
        this.loading = false;
        console.log('Wishlist:', this.wishlistDetails);
      },
      error: (err) => {
        this.error = 'Failed to load wishlist. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  removeItem(productId: string) {
    this.wishlistService.removeWishlistItem(productId).subscribe({
      next: (response) => {
        console.log('Product removed successfully', response);
        this.toastService.success('Product removed from wishlist!');
        // Remove the item from the local array instead of reloading all data
        this.wishlistDetails = this.wishlistDetails.filter(item => item._id !== productId);
        // The wishlist service will automatically update the count via the tap operator
      },
      error: (err) => {
        this.toastService.error('Failed to remove product. Please try again.');
        console.error('Error removing product:', err);
      }
    });
  }

  addToCart(productId: string) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        
        // Remove the item from wishlist after successfully adding to cart
        this.removeItemFromWishlist(productId);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        this.toastService.error('Failed to add product to cart. Please try again.');
      }
    });
  }

  private removeItemFromWishlist(productId: string) {
    this.wishlistService.removeWishlistItem(productId).subscribe({
      next: (response) => {
        console.log('Product removed from wishlist after adding to cart:', response);
        // Remove the item from the local array instead of reloading all data
        this.wishlistDetails = this.wishlistDetails.filter(item => item._id !== productId);
        // The wishlist service will automatically update the count via the tap operator
        this.toastService.success('Product moved from wishlist to cart!');
      },
      error: (err) => {
        console.error('Error removing product from wishlist:', err);
        // Don't show error to user as the main action (add to cart) was successful
        // Just log the error for debugging
      }
    });
  }

  
}
