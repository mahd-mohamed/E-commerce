import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService)
  cartDetails:Cart={} as Cart
  loading: boolean = true;
  error: string = '';
  ngOnInit(): void {
    this.getLoggedUserData();
      
  }
  getLoggedUserData(){
    this.loading = true;
    this.error = '';
    
    this.cartService.getLoggedUserCart().subscribe({
      next:(response)=>{
        this.cartDetails=response.data
        this.loading = false;
        console.log(response.data)
      },
      error:(err)=>{
        this.error = 'Failed to load cart. Please try again.';
        this.loading = false;
        console.log(err)
      }
    })
  }

  updateProductQuantity(productId: string, count: number) {
    this.cartService.updateCartProductQuantity(productId, count).subscribe({
      next: (response) => {
        console.log('Quantity updated successfully', response);
        // Refresh cart data to ensure real-time updates
        this.getLoggedUserData();
      },
      error: (err) => {
        console.log('Error updating quantity:', err);
      }
    });
  }

  removeProduct(productId: string) {
    this.cartService.removeCartItem(productId).subscribe({
      next: (response) => {
        console.log('Product removed successfully', response);
        // Refresh cart data to ensure real-time updates
        this.getLoggedUserData();
      },
      error: (err) => {
        console.log('Error removing product:', err);
      }
    });
  }

  increaseQuantity(item: any) {
    const newCount = item.count + 1;
    this.updateProductQuantity(item.product._id, newCount);
  }

  decreaseQuantity(item: any) {
    if (item.count > 1) {
      const newCount = item.count - 1;
      this.updateProductQuantity(item.product._id, newCount);
    }
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: (response) => {
        console.log('Cart cleared successfully', response);
        // Refresh cart data to ensure real-time updates
        this.getLoggedUserData();
      },
      error: (err) => {
        console.log('Error clearing cart:', err);
      }
    });
  }


}
