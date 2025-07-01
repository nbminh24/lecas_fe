import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
  @Input() product!: Product;
  selectedSize = '';
  selectedColor = '';
  quantity = 1;
  showQuickAdd = false;
  Math = Math;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    if (this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[0];
    }
    if (this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0].name;
    }
  }

  addToCart(): void {
    if (this.selectedSize && this.selectedColor) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
      this.showQuickAdd = false;
    }
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
    if (this.selectedSize && this.selectedColor) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
      this.router.navigate(['/checkout']);
    }
  }
}
