import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from './details.service';
import { Product } from '../../core/models/product.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../wishlist/services/wishlist.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly detailsService= inject(DetailsService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly wishlistService= inject(WishlistService);

  
  productdetails:Product = {} as Product;

  id: string | null = null;
  selectedImage: string = '';

  ngOnInit(): void {
    this.getproductId();
    this.getProductDetails();
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
        },
        error: (err) => {
          console.log(err)
        }
      });
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
    addToWishlist(id: string): void {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (response) => {
        console.log('Product added to wishlist:', response);
        this.toastService.success('Product added to wishlist successfully!');
      },
      error: (error) => {
        console.error('Error adding product to wishlist:', error);
        this.toastService.error('Failed to add product to wishlist. Please try again.');
      }
    });
  }
}

