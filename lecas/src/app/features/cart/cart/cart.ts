import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { CartItem } from '../../../core/models/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = true;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart.items;
      this.isLoading = false;
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateItemQuantity(item.id, newQuantity);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= 500000 ? 0 : 30000; // Free shipping for orders >= 500k
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  getDiscountAmount(): number {
    // Mock discount logic
    const subtotal = this.getSubtotal();
    if (subtotal >= 1000000) {
      return subtotal * 0.1; // 10% discount for orders >= 1M
    }
    return 0;
  }

  getFinalTotal(): number {
    return this.getTotal() - this.getDiscountAmount();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getDiscountPercentage(): number {
    const subtotal = this.getSubtotal();
    if (subtotal >= 1000000) {
      return 10;
    }
    return 0;
  }

  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}
