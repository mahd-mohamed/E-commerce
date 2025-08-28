import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  msgerror:string=''
  isLoading: boolean = false;
  
  // Password visibility states
  showPassword: boolean = false;
  showRePassword: boolean = false;
  
  RegisterForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
    rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  },{validators:this.confirmpassword});

  confirmpassword(group:AbstractControl){
    let password=group.get('password')?.value;
    let rePassword=group.get('rePassword')?.value;
    if(password==rePassword){
      return null
    }
    else{
          return {mismatch:true}
         }

  }

  SubmitForm() {
    if (this.RegisterForm.valid) {
      this.isLoading = true;
      this.msgerror = ''; // Clear previous errors
      
      this.authService.registerForm(this.RegisterForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoading = false;
          //navigate to login
          if(response.message=='success'){
            this.msgerror = '';
            setTimeout(() => {
              this.router.navigate(['/login'])
              
            }, 1500);

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
      this.RegisterForm.get('rePassword')?.patchValue('');

      this.RegisterForm.markAllAsTouched();
    }
  }

  // Password visibility toggle methods
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRePasswordVisibility() {
    this.showRePassword = !this.showRePassword;
  }
}



