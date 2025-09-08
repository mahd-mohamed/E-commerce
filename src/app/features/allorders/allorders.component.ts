import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from './services/orders.service';
import { Orders } from './models/orders.interface';
import { Subscription } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllordersComponent implements OnInit, OnDestroy {
  private readonly ordersService = inject(OrdersService);
  private readonly toastService = inject(ToastService);
  private subscription: Subscription = new Subscription();

  orders: Orders[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscription = this.ordersService.getUserOrders().subscribe({
      next: (orders) => {
        // Sort orders by newest first based on createdAt
        this.orders = [...orders].sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load orders';
        this.toastService.error(this.errorMessage);
        console.error('Error loading orders:', error);
      }
    });
  }

  getOrderStatus(order: Orders): { status: string; color: string; bgColor: string } {
    if (order.isDelivered) {
      return { status: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (order.isPaid) {
      return { status: 'Processing', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    } else {
      return { status: 'Pending Payment', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
  }

  getPaymentMethodIcon(paymentMethod: string): string {
    return paymentMethod === 'cash' ? 'fas fa-money-bill-wave' : 'fas fa-credit-card';
  }

  getPaymentMethodText(paymentMethod: string): string {
    return paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card Payment';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(price);
  }
}
