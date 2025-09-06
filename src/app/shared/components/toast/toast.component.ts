import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div 
          class="toast"
          [class]="'toast-' + toast.type"
          (click)="removeToast(toast.id)">
          <div class="toast-content">
            <div class="toast-icon">
              @switch (toast.type) {
                @case ('success') {
                  <i class="fas fa-check-circle"></i>
                }
                @case ('error') {
                  <i class="fas fa-exclamation-circle"></i>
                }
                @case ('warning') {
                  <i class="fas fa-exclamation-triangle"></i>
                }
                @case ('info') {
                  <i class="fas fa-info-circle"></i>
                }
              }
            </div>
            <div class="toast-message">{{ toast.message }}</div>
            <button 
              class="toast-close"
              (click)="removeToast(toast.id, $event)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .toast:hover {
      transform: translateX(-5px);
    }

    .toast-success {
      border-left-color: #10b981;
    }

    .toast-error {
      border-left-color: #ef4444;
    }

    .toast-warning {
      border-left-color: #f59e0b;
    }

    .toast-info {
      border-left-color: #3b82f6;
    }

    .toast-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
    }

    .toast-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .toast-success .toast-icon {
      color: #10b981;
    }

    .toast-error .toast-icon {
      color: #ef4444;
    }

    .toast-warning .toast-icon {
      color: #f59e0b;
    }

    .toast-info .toast-icon {
      color: #3b82f6;
    }

    .toast-message {
      flex: 1;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
    }

    .toast-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: #6b7280;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .toast {
        background: #1f2937;
        color: white;
      }

      .toast-message {
        color: #f9fafb;
      }

      .toast-close {
        color: #9ca3af;
      }

      .toast-close:hover {
        color: #d1d5db;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  private readonly toastService = inject(ToastService);
  private subscription: Subscription = new Subscription();

  toasts: ToastMessage[] = [];

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.toastService.remove(id);
  }
}
