import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from './details.service';
import { log } from 'console';
import { Product } from '../../core/models/product.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  addToCart(): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', this.productdetails.title);
  }
}

