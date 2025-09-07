import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { CashService } from './services/cash.service';
import { VisaService } from './services/visa.service';
import { ToastService } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cashService = inject(CashService);
  private readonly visaService = inject(VisaService);
  private readonly toastService = inject(ToastService);
  
  checkoutForm !: FormGroup;
  isLoading: boolean = false;
  selectedPayment: string = '';
  id: string | null = null;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.initForm();
    this.getCartId();
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, Validators.required],
        phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        city: [null, Validators.required]
      })
    });
  }
  getCartId() {
    return this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        console.log(this.id);
      },
      error: (err) => {
        console.log(err);
        }
    });
  }

  onPaymentSelect(method: string) {
    this.selectedPayment = method;
  }

  onCashPayment() {
    if (this.checkoutForm.valid && this.id) {
      this.isLoading = true;
      this.selectedPayment = 'cash';

      const shippingAddress = this.checkoutForm.get('shippingAddress')?.value;
      
      this.subscription = this.cashService.processCashPayment(this.id, shippingAddress).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status === 'success') {
            this.toastService.success('Cash payment processed successfully! Your order will be delivered soon.');
            setTimeout(() => {
              this.router.navigate(['/allorders']);
            }, 2000);
            console.log('Cash payment successful:', response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          const errorMsg = error.error?.message || 'Payment failed. Please try again.';
          this.toastService.error(errorMsg);
          console.error('Cash payment error:', error);
        }
      });
    } else {
      this.checkoutForm.markAllAsTouched();
      this.toastService.warning('Please fill in all required fields.');
    }
  }

  onVisaPayment() {
    if (this.checkoutForm.valid && this.id) {
      this.isLoading = true;
      this.selectedPayment = 'visa';

      const shippingAddress = this.checkoutForm.get('shippingAddress')?.value;
      
      this.subscription = this.visaService.processVisaPayment(this.id, shippingAddress).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status === 'success') {
            this.toastService.info('Redirecting to secure payment page...');
            // Redirect to Stripe checkout URL
            setTimeout(() => {
              window.location.href = response.session.url;
            }, 1500);
          }
        },
        error: (error) => {
          this.isLoading = false;
          const errorMsg = error.error?.message || 'Payment failed. Please try again.';
          this.toastService.error(errorMsg);
          console.error('Visa payment error:', error);
        }
      });
    } else {
      this.checkoutForm.markAllAsTouched();
      this.toastService.warning('Please fill in all required fields.');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
