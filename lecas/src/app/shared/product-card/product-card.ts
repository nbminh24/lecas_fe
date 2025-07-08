import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart';
import { AddToCartRequest } from '../../core/models/cart.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
  @Input() product!: Product;
  quantity = 1;
  showQuickAdd = false;
  Math = Math;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    // Initialize with default values if needed
  }

  addToCart(): void {
    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.quantity
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        this.showQuickAdd = false;
        // You can add a success message here
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        // You can add an error message here
      }
    });
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getDiscountPercentage(): number {
    if (this.product.originalPrice) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return 0;
  }

  toggleQuickAdd(): void {
    this.showQuickAdd = !this.showQuickAdd;
  }

  buyNow(): void {
    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.quantity
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        // You can add an error message here
      }
    });
  }
}
