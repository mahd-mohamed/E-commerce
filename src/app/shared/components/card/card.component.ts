import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() product: Product = {} as Product;

  getDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (!originalPrice || !discountedPrice) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }

  addToCart(product: Product, event: Event): void {
    // Prevent event propagation to avoid triggering the card's routerLink
    event.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product.title);
  }

  viewProduct(product: Product): void {
    // TODO: Implement navigation to product details
    console.log('Viewing product:', product.title);
  }

  toggleWishlist(product: Product): void {
    // TODO: Implement wishlist functionality
    console.log('Toggling wishlist for:', product.title);
  }
}
