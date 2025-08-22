import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Swiper from 'swiper';

@Component({
  selector: 'app-main-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-slider.component.html',
  styleUrl: './main-slider.component.css'
})
export class MainSliderComponent implements OnInit, AfterViewInit {

  @ViewChild('mainSwiperContainer') mainSwiperContainer!: ElementRef;

  slides: any[] = [
    {
      id: 1,
      image: 'images/slider-image-1.jpeg',
      title: 'Amazing Deals'
    },
    {
      id: 2,
      image: 'images/slider-image-2.jpeg',
      title: 'New Collection'
    },
    {
      id: 3,
      image: 'images/slider-image-3.jpeg',
      title: 'Premium Quality'
    },
    {
      id: 4,
      image: 'images/slider-2.jpeg',
      title: 'Fast Delivery'
    }
  ];

  private swiper: Swiper | null = null;

  // Swiper configuration
  swiperConfig = {
    modules: [Autoplay, Pagination, EffectFade],
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.main-swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    }
  };

  ngOnInit(): void {
    // Initialize swiper immediately
    setTimeout(() => {
      this.initializeSwiper();
    }, 100);
  }

  ngAfterViewInit(): void {
    // Don't initialize here as loading might still be active
  }

  private initializeSwiper(): void {
    if (this.mainSwiperContainer && this.slides.length > 0) {
      console.log('Initializing Main Swiper with', this.slides.length, 'slides');

      // Destroy existing swiper if it exists
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }

      // Wait for DOM to be ready
      setTimeout(() => {
        try {
          // Initialize new swiper
          this.swiper = new Swiper(this.mainSwiperContainer.nativeElement, this.swiperConfig);



          console.log('Main Swiper initialized successfully');
        } catch (error) {
          console.error('Error initializing Main Swiper:', error);
        }
      }, 100);
    }
  }

  onImageError(event: any): void {
    // Set a default image when the slide image fails to load
    event.target.src = 'assets/images/placeholder-slide.jpg';
  }

  trackBySlide(index: number, slide: any): number {
    return slide.id;
  }
}
