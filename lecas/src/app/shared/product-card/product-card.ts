import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart';
import { AddToCartRequest } from '../../core/models/cart.interface';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { CreateOrderRequest, Address } from '../../core/models/order.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
  @Input() product: any;
  @Input() skeleton: boolean = false;
  quantity = 1;
  showQuickAdd = false;
  Math = Math;
  selectedSize = '';
  selectedColor = '';
  addCartSuccess = false;

  showAddressForm = false;
  newShippingAddress: Address = {
    type: 'home',
    address: '',
    city: '',
    district: '',
    ward: ''
  };

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    // Initialize with default values if needed
  }

  get availableSizes(): string[] {
    return this.product.sizes || [];
  }

  get availableColors(): string[] {
    return (this.product.colors || []).map((c: any) => c.name);
  }

  addToCart(): void {
    if (!this.selectedSize && this.availableSizes.length > 0) return;
    if (!this.selectedColor && this.availableColors.length > 0) return;
    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.quantity,
      size: this.selectedSize,
      color: this.selectedColor
    };
    this.cartService.addToCart(request).subscribe({
      next: () => {
        this.showQuickAdd = false;
        this.selectedSize = '';
        this.selectedColor = '';
        this.quantity = 1;
        this.addCartSuccess = true;
        setTimeout(() => this.addCartSuccess = false, 1500);
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

  showAddressInput(): void {
    this.showAddressForm = true;
    this.newShippingAddress = {
      type: 'home', address: '', city: '', district: '', ward: ''
    };
  }

  hideAddressInput(): void {
    this.showAddressForm = false;
  }

  buyNow(): void {
    if (!this.selectedSize && this.availableSizes.length > 0) return;
    if (!this.selectedColor && this.availableColors.length > 0) return;
    const productData = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      images: this.product.images,
      originalPrice: this.product.originalPrice || null
    };
    this.router.navigate(['/checkout'], {
      state: {
        buyNow: true,
        product: productData,
        quantity: this.quantity,
        size: this.selectedSize,
        color: this.selectedColor
      }
    });
  }
}
