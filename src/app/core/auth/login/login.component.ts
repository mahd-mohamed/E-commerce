import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  msgerror:string=''
  isLoading: boolean = false;
  
  // Password visibility state
  showPassword: boolean = false;
  
  LoginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
  });

  

  SubmitForm() {
    if (this.LoginForm.valid) {
      this.isLoading = true;
      this.msgerror = ''; // Clear previous errors
      
      this.authService.loginForm(this.LoginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoading = false;
          //navigate to login
          if(response.message=='success'){
            this.msgerror = '';
            setTimeout(() => {
              this.router.navigate(['/home'])
              
            }, 1000);

          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
          this.msgerror = error.error.message;
        }
      })
    }
     else{
      
      this.LoginForm.markAllAsTouched();
    }
  }

  // Password visibility toggle method
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
