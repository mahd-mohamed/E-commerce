import { CategoriesComponent } from './features/categories/categories.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductsComponent } from './features/products/products.component';
import { BrandsComponent } from './features/brands/brands.component';
import { DetailsComponent } from './features/details/details.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { NotfoundComponent } from './features/notfound/notfound.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: 'cart', component: CartComponent, title: 'Cart' },
      { path: 'product', component: ProductsComponent, title: 'Product' },
      { path: 'brands', component: BrandsComponent, title: 'Brands' },
      { path: 'categories', component: CategoriesComponent, title: 'Categories' },
      { path: 'details/:id/:slug', component: DetailsComponent, title: 'Details' },
      { path: 'details/:id', component: DetailsComponent, title: 'Details' },

      { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
    ],
  },
  { path: '**', component: NotfoundComponent, title: 'Not Found' },
];
