import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryDetailsService } from './category-details.service';
import { Category } from '../../core/models/category.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly categoryDetailsService = inject(CategoryDetailsService);
    categoryDetails:Category = {} as Category;
    id: string | null = null;

   ngOnInit(): void {
  console.log('CategoryDetailsComponent ngOnInit called');
  this.activatedRoute.paramMap.subscribe({
    next: (urlParams) => {
      this.id = urlParams.get('id');
      console.log('Category ID from route:', this.id);
      if (this.id) {
        this.getCategoryDetails(this.id);
      }
    }
  });
}
     getCategoryDetails(id: string): void {
  console.log('Fetching category details for ID:', id);
  this.categoryDetailsService.getCategoryDetails(id).subscribe({
    next: (res) => {
      console.log('API Response:', res);
      console.log('Category data:', res.data);
      this.categoryDetails = res.data;
      console.log('Updated categoryDetails:', this.categoryDetails);
    },
    error: (err) => {
      console.error('Error fetching category details:', err);
    }
  });
      }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/images/placeholder-category.svg';
    }
  }

}
