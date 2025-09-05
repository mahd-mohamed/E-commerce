import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrandsService } from './services/brands.service';
import { Brand, BrandsApiResponse, BrandResponse } from './models/brand.interface';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  
  brands: Brand[] = [];
  loading = false;
  error = '';
  pageSize: number = 12;
  p: number = 1;
  total: number = 0;

  // Modal state
  isModalOpen = false;
  modalLoading = false;
  modalError = '';
  selectedBrand: Brand | undefined;

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(pageNumber: number = 1): void {
    this.loading = true;
    this.error = '';
    
    this.brandsService.getAllBrands(12, undefined, pageNumber).subscribe({
      next: (response: BrandsApiResponse) => {
        this.brands = response.data;
        this.pageSize = response.metadata.limit;
        this.p = response.metadata.currentPage;
        // Try to get total from metadata first, then from results
        this.total = response.metadata.total || response.results;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load brands. Please try again.';
        this.loading = false;
        console.error('Error loading brands:', error);
      }
    });
  }

  retryLoadBrands(): void {
    this.loadBrands();
  }

  pageChanged(page: number): void {
    // Scroll to top smoothly before changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add a small delay to ensure smooth scroll completes
    setTimeout(() => {
      this.loadBrands(page);
    }, 300);
  }

  viewBrand(brandId: string): void {
    this.isModalOpen = true;
    this.modalLoading = true;
    this.modalError = '';
    this.selectedBrand = undefined;

    this.brandsService.getBrandById(brandId).subscribe({
      next: (response: BrandResponse) => {
        this.selectedBrand = response.data;
        this.modalLoading = false;
      },
      error: (error) => {
        this.modalError = 'Failed to load brand details. Please try again.';
        this.modalLoading = false;
        console.error('Error loading brand by id:', error);
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalLoading = false;
    this.modalError = '';
    this.selectedBrand = undefined;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="w-full h-full bg-gray-700 flex items-center justify-center"><i class="fas fa-building text-gray-400 text-4xl"></i></div>';
    }
  }
}
