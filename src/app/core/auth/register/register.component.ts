import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { InputComponent } from "../../../shared/components/input/input.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  subscription: Subscription = new Subscription();

  msgerror: string = '';
  isLoading: boolean = false;


  RegisterForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.RegisterForm = this.fb.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]
        ],
        rePassword: [
          null,
          [Validators.required]
        ],
        phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
      },
      { validators: this.confirmPassword }
    );
  }

  confirmPassword(group: AbstractControl) {
   if(group.get('password')?.value === group.get('rePassword')?.value){
    return null

   }
   else{
    group.get('rePassword')?.setErrors({mismatch:true})
    return {mismatch:true}
   }
  }

  SubmitForm() {
    if (this.RegisterForm.valid) {
      this.subscription.unsubscribe();
      this.isLoading = true;
      this.msgerror = '';

      this.subscription = this.authService.registerForm(this.RegisterForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.message === 'success') {
            this.msgerror = '';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.msgerror = error.error.message;
        }
      });
    } else {
      this.RegisterForm.get('rePassword')?.patchValue('');
      this.RegisterForm.markAllAsTouched();
    }
  }


}