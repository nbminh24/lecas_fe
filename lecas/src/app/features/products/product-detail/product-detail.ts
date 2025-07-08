import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { Product } from '../../../core/models/product.interface';
import { AddToCartRequest } from '../../../core/models/cart.interface';
import { ShopServiceFeaturesComponent } from '../../../shared/product-features/shop-service-features.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ShopServiceFeaturesComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  selectedImageIndex = 0;
  quantity = 1;
  isLoading = true;
  error = '';
  Math = Math;
  selectedSize = '';
  selectedColor = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: string): void {
    this.isLoading = true;
    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải thông tin sản phẩm';
        this.isLoading = false;
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.quantity
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        // Show success message
        console.log('Added to cart successfully');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  buyNow(): void {
    if (!this.product) return;
    if (this.availableSizes.length > 0 && !this.selectedSize) return;
    if (this.availableColors.length > 0 && !this.selectedColor) return;
    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.quantity,
      size: this.selectedSize,
      color: this.selectedColor
    };
    this.cartService.addToCart(request).subscribe({
      next: () => {
        // Đảm bảo reload lại giỏ hàng trước khi chuyển trang
        this.cartService["loadCart"]();
        setTimeout(() => {
          this.router.navigate(['/checkout']);
        }, 200); // delay nhỏ để đảm bảo cart cập nhật
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getDiscountPercentage(): number {
    if (!this.product?.originalPrice) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }

  getCategoryDisplayName(category: string): string {
    switch (category) {
      case 'TOPS': return 'Áo Nam';
      case 'BOTTOMS': return 'Quần Nam';
      case 'OUTERWEAR': return 'Áo Khoác';
      case 'ACCESSORIES': return 'Phụ Kiện';
      default: return category;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  get availableSizes(): string[] {
    return this.product?.sizes || [];
  }

  get availableColors(): string[] {
    return (this.product?.colors || []).map(c => c.name);
  }
}
