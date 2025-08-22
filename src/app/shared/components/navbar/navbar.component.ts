import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './../../../core/services/flowbite.service';
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input({ required: true }) isLogin!: boolean;
  isMobileMenuOpen = false;
  isScrolled = false;
  
  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    try {
      this.flowbiteService.loadFlowbite((FlowbiteService) => {
        initFlowbite();
      });
    } catch (error) {
      console.error('Error loading Flowbite:', error);
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
  }
}
