import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from './details.service';
import { Product } from '../../core/models/product.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../wishlist/services/wishlist.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly detailsService= inject(DetailsService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly wishlistService= inject(WishlistService);
  private readonly cookieService = inject(CookieService);
  

  
  productdetails:Product = {} as Product;

  id: string | null = null;
  selectedImage: string = '';
  isInWishlist: boolean = false;

  ngOnInit(): void {
    this.getproductId();
    this.getProductDetails();
    this.checkInitialWishlistState();
    // Load wishlist data if user is logged in
    const token = this.cookieService.get('token');
    if (token) {
      this.wishlistService.refreshWishlist();
    }
  }

  ngOnDestroy(): void {
    // No subscriptions to clean up
  }

  getproductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next:(urlParams)=> {
        urlParams.get('id');
        this.id = urlParams.get('id');
      }
    }) 
  }

  getProductDetails(): void {
    if (this.id) {
      this.detailsService.getProductDetails(this.id).subscribe({
        next: (res) => {
          console.log(res.data);
          this.productdetails = res.data;
          this.selectedImage = this.productdetails.imageCover;
          // Check wishlist state after product is loaded
          this.checkInitialWishlistState();
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }

  private checkInitialWishlistState(): void {
    // Get current wishlist state synchronously
    const currentWishlist = this.wishlistService.currentWishlistState;
    this.checkIfInWishlist(currentWishlist);
  }

  private checkIfInWishlist(wishlistData: any): void {
    if (wishlistData && Array.isArray(wishlistData)) {
      this.isInWishlist = wishlistData.some((item: any) => item._id === this.productdetails._id);
    } else {
      this.isInWishlist = false;
    }
  }

  // Helper methods for template
  getDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('fas fa-star');
    }
    
    if (hasHalfStar) {
      stars.push('fas fa-star-half-alt');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('far fa-star');
    }
    
    return stars;
  }

  // Action methods
  addToCart(id: string): void {
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
  toggleWishlist(id: string): void {
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

