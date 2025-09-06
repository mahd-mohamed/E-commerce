import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';


@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  @Input() product: Product = {} as Product;

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
addToWishlist(id: string, event: Event): void {
  event.stopPropagation();
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
