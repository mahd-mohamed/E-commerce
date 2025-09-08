import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../services/auth.service';
import { Subscription, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, InputComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Forms
  verifyEmail!: FormGroup;
  verifyCode!: FormGroup;
  resetPassword!: FormGroup;

  // State
  currentStep = 1;
  isLoading = false;
  msgerror = '';
  userEmail = '';
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.initForm();
  }

  get progressPercent(): number {
    const totalSteps = 4;
    return Math.round(((this.currentStep - 1) / (totalSteps - 1)) * 100);
  }

  initForm(): void {
    this.verifyEmail = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });

    this.verifyCode = this.fb.group({
      code: [null, [Validators.required, Validators.pattern(/^\d{4,6}$/)]]
    });

    this.resetPassword = this.fb.group({
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        ]
      ]
    });
  }

  async sendResetCode(): Promise<void> {
    if (!this.verifyEmail.valid) {
      this.verifyEmail.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.msgerror = '';
    this.userEmail = this.verifyEmail.get('email')?.value;

    try {
      await firstValueFrom(this.authService.sendResetCode({ email: this.userEmail }));
      this.currentStep = 2;
    } catch (error: any) {
      this.msgerror = error.error?.message || error.message || 'Failed to send reset code';
    } finally {
      this.isLoading = false;
    }
  }

  async verifyResetCode(): Promise<void> {
    if (!this.verifyCode.valid) {
      this.verifyCode.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.msgerror = '';

    const data = {
      email: this.userEmail,
      resetCode: this.verifyCode.get('code')?.value
    };

    try {
      await firstValueFrom(this.authService.verifyResetCode(data));
      this.currentStep = 3;
    } catch (error: any) {
      this.msgerror = error.error?.message || error.message || 'Invalid verification code';
    } finally {
      this.isLoading = false;
    }
  }

  async resetUserPassword(): Promise<void> {
    if (!this.resetPassword.valid) {
      this.resetPassword.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.msgerror = '';

    const data = {
      email: this.userEmail, 
      newPassword: this.resetPassword.get('newPassword')?.value
    };

    try {
      await firstValueFrom(this.authService.resetUserPassword(data));
      this.currentStep = 4;
    } catch (error: any) {
      this.msgerror = error.error?.message || error.message || 'Failed to reset password';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
