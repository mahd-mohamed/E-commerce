import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './../../../core/services/flowbite.service';
import { Component, Input, OnInit, OnChanges, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) isLogin!: boolean;
  isMobileMenuOpen = false;
  isScrolled = false;
  cartCount: number = 0;
  private cartUpdateSubscription?: Subscription;
  
  constructor(private flowbiteService: FlowbiteService) {}
  private readonly authService = inject(AuthService)
  private readonly cartService = inject(CartService)

  ngOnInit(): void {
    try {
      this.flowbiteService.loadFlowbite((FlowbiteService) => {
        initFlowbite();
      });
    } catch (error) {
      console.error('Error loading Flowbite:', error);
    }
    
    // Load cart count if user is logged in
    if (this.isLogin) {
      console.log('User is logged in, loading cart count...');
      this.loadCartCount();
      this.startCartUpdateInterval();
    } else {
      console.log('User is not logged in, cart count set to 0');
      this.cartCount = 0;
    }
  }

  ngOnChanges(): void {
    // Reload cart count when isLogin changes
    if (this.isLogin) {
      this.loadCartCount();
      this.startCartUpdateInterval();
    } else {
      this.cartCount = 0;
      this.stopCartUpdateInterval();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  // Close mobile menu when clicking on a link
  onLinkClick(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    // Refresh cart count when navigating
    this.refreshCartCount();
  }
  logout(): void {
    this.authService.logout();
  }

  loadCartCount(): void {
    console.log('Loading cart count...');
    this.cartService.getLoggedUserCart().subscribe({
      next: (response) => {
        this.cartCount = response.data?.products?.length || 0;
      },
      error: (err) => {
        console.log('Error loading cart count:', err);
        this.cartCount = 0;
      }
    });
  }

  // Public method to refresh cart count (can be called from parent components)
  refreshCartCount(): void {
    if (this.isLogin) {
      this.loadCartCount();
    }
  }

  // Start automatic cart count updates every 2 seconds
  private startCartUpdateInterval(): void {
    this.stopCartUpdateInterval(); // Stop any existing interval
    this.cartUpdateSubscription = interval(2000).subscribe(() => {
      if (this.isLogin) {
        this.loadCartCount();
      }
    });
  }

  // Stop automatic cart count updates
  private stopCartUpdateInterval(): void {
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
      this.cartUpdateSubscription = undefined;
    }
  }

  // Clean up subscriptions when component is destroyed
  ngOnDestroy(): void {
    this.stopCartUpdateInterval();
  }
}
