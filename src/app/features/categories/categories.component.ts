import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { SubCategoryService } from '../../core/services/subcategories/subcategories.service';
import { Category } from '../../core/models/category.interface';
import { SubCategory } from '../../core/models/subcategory.interface';




@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  loading: boolean = true;
  error: string = '';
  
  // Pagination properties for subcategories (matching Products)
  subCategoriesPageSize!: number;
  subCategoriesCurrentPage!: number;
  subCategoriesTotal!: number;
  subCategoriesLoading: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private subCategoryService: SubCategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';
    
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load categories. Please try again.';
        this.loading = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/images/placeholder-category.svg';
    }
  }

  loadSubCategories(pageNumber: number = 1): void {
    this.subCategoriesLoading = true;
    
    this.subCategoryService.getAllSubCategories(pageNumber, 10).subscribe({
      next: (response) => {
        this.subCategories = response.data;
        this.subCategoriesPageSize = response.metadata.limit;
        this.subCategoriesCurrentPage = response.metadata.currentPage;
        this.subCategoriesTotal = response.results;
        this.subCategoriesLoading = false;
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.subCategoriesLoading = false;
      }
    });
  }

  subCategoriesPageChanged(page: number): void {
    // Scroll to subcategories section smoothly before changing page
    const element = document.querySelector('.subcategories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add a small delay to ensure smooth scroll completes
    setTimeout(() => {
      this.loadSubCategories(page);
    }, 300);
  }
}
