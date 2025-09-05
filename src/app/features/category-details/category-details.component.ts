import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryDetailsService } from './category-details.service';
import { Category } from '../../core/models/category.interface';
import { CommonModule } from '@angular/common';
import { SubCategoryService } from '../../core/services/subcategories/subcategories.service';
import { SubCategory, SubCategoryResponse } from '../../core/models/subcategory.interface';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly categoryDetailsService = inject(CategoryDetailsService);
    private readonly subCategoryService = inject(SubCategoryService);
    
    categoryDetails: Category = {} as Category;
    id: string | null = null;
    
    // SubCategories properties
    subCategories: SubCategory[] = [];
    subCategoriesLoading = false;
    subCategoriesError = '';
    subCategoriesPageSize = 12;
    subCategoriesCurrentPage = 1;
    subCategoriesTotal = 0;

   ngOnInit(): void {
  console.log('CategoryDetailsComponent ngOnInit called');
  this.activatedRoute.paramMap.subscribe({
    next: (urlParams) => {
      this.id = urlParams.get('id');
      console.log('Category ID from route:', this.id);
      if (this.id) {
        this.getCategoryDetails(this.id);
        this.loadSubCategories(this.id);
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

  loadSubCategories(categoryId: string): void {
    this.subCategoriesLoading = true;
    this.subCategoriesError = '';
    
    this.subCategoryService.getSubCategoriesByCategory(categoryId).subscribe({
      next: (response: SubCategoryResponse) => {
        this.subCategories = response.data;
        this.subCategoriesTotal = response.results;
        this.subCategoriesLoading = false;
        console.log('SubCategories loaded:', this.subCategories);
      },
      error: (error) => {
        this.subCategoriesError = 'Failed to load subcategories. Please try again.';
        this.subCategoriesLoading = false;
        console.error('Error loading subcategories:', error);
      }
    });
  }

  subCategoriesPageChanged(page: number): void {
    this.subCategoriesCurrentPage = page;
    if (this.id) {
      this.loadSubCategories(this.id);
    }
  }

}
