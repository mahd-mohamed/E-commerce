import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Category } from '../../../../core/models/category.interface';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import Swiper from 'swiper';

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css'
})
export class PopularCategoriesComponent implements OnInit, AfterViewInit {

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  private readonly categoriesService = inject(CategoriesService);

  categoriesList: Category[] = [];
  isLoading: boolean = true;
  private swiper: Swiper | null = null;

  // Swiper configuration
  swiperConfig = {
    modules: [Pagination, Navigation, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    }
  };

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  ngAfterViewInit(): void {
    // Initialize swiper after view is initialized
    setTimeout(() => {
      this.initializeSwiper();
    }, 100);
  }

  getAllCategoriesData(): void {
    this.isLoading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (response: any) => {
        console.log('Categories:', response.data);
        this.categoriesList = response.data;
        this.isLoading = false;
        // Initialize swiper after data is loaded
        setTimeout(() => {
          this.initializeSwiper();
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false;
      }
    });
  }

  private initializeSwiper(): void {
    if (this.swiperContainer && this.categoriesList.length > 0) {
      console.log('Initializing Category Swiper with', this.categoriesList.length, 'categories');

      // Destroy existing swiper if it exists
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }

      // Wait for DOM to be ready
      setTimeout(() => {
        try {
          // Initialize new swiper
          this.swiper = new Swiper(this.swiperContainer.nativeElement, this.swiperConfig);

          // Ensure navigation elements are properly set
          if (this.swiper.navigation) {
            this.swiper.navigation.init();
            this.swiper.navigation.update();
          }

          // Ensure pagination is properly set
          if (this.swiper.pagination) {
            this.swiper.pagination.init();
            this.swiper.pagination.update();
          }

          console.log('Category Swiper initialized successfully');
        } catch (error) {
          console.error('Error initializing Category Swiper:', error);
        }
      }, 100);
    }
  }

  onImageError(event: any): void {
    // Set a default image when the category image fails to load
    event.target.src = 'assets/images/placeholder-category.svg';
  }

  trackByCategory(index: number, category: Category): string {
    return category._id;
  }
}
