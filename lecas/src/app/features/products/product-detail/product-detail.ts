import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  selectedImageIndex = 0;
  selectedSize = '';
  selectedColor = '';
  quantity = 1;
  isLoading = true;
  error = '';
  Math = Math;

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
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          if (product.sizes.length > 0) {
            this.selectedSize = product.sizes[0];
          }
          if (product.colors.length > 0) {
            this.selectedColor = product.colors[0].name;
          }
        } else {
          this.error = 'Sản phẩm không tồn tại';
        }
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

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
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
    if (!this.product || !this.selectedSize || !this.selectedColor) {
      return;
    }

    this.cartService.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
    // Show success message or navigate to cart
  }

  buyNow(): void {
    if (!this.product || !this.selectedSize || !this.selectedColor) {
      return;
    }

    this.cartService.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
    this.router.navigate(['/checkout']);
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

  isSizeAvailable(size: string): boolean {
    return this.product?.sizes.includes(size) || false;
  }

  isColorAvailable(color: string): boolean {
    return this.product?.colors.some(c => c.name === color) || false;
  }
}
