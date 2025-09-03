import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { InputComponent } from "../../../shared/components/input/input.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cookieService = inject(CookieService);

  subscription: Subscription = new Subscription();

  msgerror: string = '';
  isLoading: boolean = false;

  LoginForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.LoginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]
      ]
    });
  }

  SubmitForm() {
    if (this.LoginForm.valid) {
      this.subscription.unsubscribe();
      this.isLoading = true;
      this.msgerror = '';

      this.subscription = this.authService.loginForm(this.LoginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.message === 'success') {
            this.cookieService.set('token', response.token);
            console.log(this.authService.decodeToken());
            this.msgerror = '';
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.msgerror = error.error.message;
        }
      });
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }

  
}