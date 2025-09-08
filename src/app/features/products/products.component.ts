import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/models/product.interface';
import { ProductsService, ApiResponse } from '../../core/services/products/products.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { NgxPaginationModule } from 'ngx-pagination'; 
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent,NgxPaginationModule,SearchPipe,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productlist: Product[] = [];
  pageSize!:number 
  p!:number; 
  total!:number; 
  loading: boolean = true;
  error: string | null = null;
  searchTerm:string = ''

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(pageNumber:number = 1): void {
    this.loading = true;
    this.error = null;
    
    this.productsService.getProducts(pageNumber, 12).subscribe({
      next: (response: ApiResponse) => {
        console.log('Products:', response.data);
        this.productlist = response.data;
        this.pageSize = response.metadata.limit;
        this.p = response.metadata.currentPage;
        this.total = response.results;
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

 


  pageChanged(page:number): void {
    // Scroll to top smoothly before changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add a small delay to ensure smooth scroll completes
    setTimeout(() => {
      this.getProducts(page);
    }, 300);
  }
}
