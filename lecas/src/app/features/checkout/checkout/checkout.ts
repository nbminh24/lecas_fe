import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { Cart, CartItem, CartSummary, UpdateCartItemRequest } from '../../../core/models/cart.interface';
import { Observable } from 'rxjs';
import { ShopServiceFeaturesComponent } from '../../../shared/product-features/shop-service-features.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopServiceFeaturesComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {
  // Thông tin nhận hàng
  customer = {
    name: '',
    phone: '',
    address: '',
    note: ''
  };

  // Phương thức thanh toán
  paymentMethod: 'vnpay' | 'momo' | 'cod' = 'vnpay';
  paymentMethods = [
    {
      value: 'zalopay',
      label: 'ZaloPay',
      icon: 'assets/payment/ZaloPay.png',
      description: 'Thanh toán qua ví ZaloPay (ATM, Visa, QR)'
    },
    {
      value: 'momo',
      label: 'Momo',
      icon: 'assets/payment/MoMo.png',
      description: 'Thanh toán qua ví điện tử Momo'
    },
    {
      value: 'cod',
      label: 'Tiền mặt',
      icon: 'assets/payment/COD.png',
      description: 'Thanh toán khi nhận hàng (COD)'
    }
  ];

  isSubmitting = false;

  constructor(private cartService: CartService, private router: Router) { }

  get cart$() {
    return this.cartService.cart$;
  }
  get cartSummary$() {
    return this.cartService.getCartSummary();
  }

  submitOrder() {
    this.isSubmitting = true;
    // Mock submit, thực tế sẽ gọi API
    setTimeout(() => {
      alert('Đặt hàng thành công! (Mock)');
      this.isSubmitting = false;
    }, 1200);
  }

  updateQuantity(item: CartItem) {
    const request: UpdateCartItemRequest = {
      quantity: item.quantity
    };
    this.cartService.updateItemQuantity(item.id, request).subscribe({
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const request: UpdateCartItemRequest = {
        quantity: item.quantity - 1
      };
      this.cartService.updateItemQuantity(item.id, request).subscribe({
        error: (error) => {
          console.error('Error updating quantity:', error);
        }
      });
    }
  }

  increaseQuantity(item: CartItem) {
    const request: UpdateCartItemRequest = {
      quantity: item.quantity + 1
    };
    this.cartService.updateItemQuantity(item.id, request).subscribe({
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id).subscribe({
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
