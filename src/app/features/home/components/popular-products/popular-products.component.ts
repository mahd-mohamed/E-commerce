import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../../shared/components/card/card.component";
import { Product } from '../../../../core/models/product.interface';
import { ProductsService, ApiResponse } from '../../../../core/services/products/products.service';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css'
})
export class PopularProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productlist: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productsService.getProducts(1, 12).subscribe({
      next: (response: ApiResponse) => {
        console.log('Products:', response.data);
        this.productlist = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  getDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (!originalPrice || !discountedPrice) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product.title);
  }

  retryLoadProducts(): void {
    this.getProducts();
  }

}
