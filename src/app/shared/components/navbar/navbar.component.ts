import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './../../../core/services/flowbite.service';
import { Component, Input, OnInit, OnChanges, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { Subscription } from 'rxjs';

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
  wishlistCount: number = 0;
  private cartCountSubscription?: Subscription;
  private wishlistCountSubscription?: Subscription;
  
  constructor(private flowbiteService: FlowbiteService) {}
  private readonly authService = inject(AuthService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)

  ngOnInit(): void {
    try {
      this.flowbiteService.loadFlowbite((FlowbiteService) => {
        initFlowbite();
      });
    } catch (error) {
      console.error('Error loading Flowbite:', error);
    }
    
    // Subscribe to cart count updates
    this.cartCountSubscription = this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count || 0;
    });

    // Subscribe to wishlist count updates
    this.wishlistCountSubscription = this.wishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount = count || 0;
      console.log("hello")
    });

    // Set initial count from service

    // Initial load if logged in
    if (this.isLogin) {
      this.cartService.refreshCart();
      this.wishlistService.refreshWishlist();
    } else {
      this.cartCount = 0;
      this.wishlistCount = 0;
    }
  }

  ngOnChanges(): void {
    // Reload cart and wishlist when isLogin changes
    if (this.isLogin) {
      this.cartService.refreshCart();
      this.wishlistService.refreshWishlist();
      // Set initial count from service
    } else {
      this.cartCount = 0;
      this.wishlistCount = 0;
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
    // Backwards compatibility method; now just ensures refresh
    this.cartService.refreshCart();
  }

  // Public method to refresh cart count (can be called from parent components)
  refreshCartCount(): void {
    if (this.isLogin) {
      this.cartService.refreshCart();
    }
  }

  // Public method to refresh wishlist count (can be called from parent components)
  refreshWishlistCount(): void {
    if (this.isLogin) {
      this.wishlistService.refreshWishlist();
    }
  }


  // Clean up subscriptions when component is destroyed
  ngOnDestroy(): void {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
      this.cartCountSubscription = undefined;
    }
    if (this.wishlistCountSubscription) {
      this.wishlistCountSubscription.unsubscribe();
      this.wishlistCountSubscription = undefined;
    }
  }
}
