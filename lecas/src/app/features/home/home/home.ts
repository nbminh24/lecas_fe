import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product, ProductCategory } from '../../../core/models/product.interface';
import { ProductCard } from '../../../shared/product-card/product-card';

interface FeaturedCategory {
  name: string;
  image: string;
  link: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  featuredCategories: FeaturedCategory[] = [
    {
      name: 'Áo Nam',
      image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Ao+Nam',
      link: '/products?category=tops',
      description: 'Áo sơ mi, áo thun, áo polo nam'
    },
    {
      name: 'Quần Nam',
      image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=Quan+Nam',
      link: '/products?category=bottoms',
      description: 'Quần jean, quần khaki, quần short'
    },
    {
      name: 'Áo Khoác',
      image: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Ao+Khoac',
      link: '/products?category=outerwear',
      description: 'Áo khoác denim, bomber, blazer'
    },
    {
      name: 'Phụ Kiện',
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Phu+Kien',
      link: '/accessories',
      description: 'Túi xách, ví, thắt lưng, mũ'
    }
  ];

  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  bestSellers: Product[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {
    console.log('Home component constructor called');
  }

  ngOnInit(): void {
    console.log('Home component ngOnInit called');
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('Loading products...');
    this.isLoading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products loaded successfully:', products.length);

        // Featured products (top rated)
        this.featuredProducts = products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);

        // New arrivals (recently added)
        this.newArrivals = products
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);

        // Best sellers (mock data - could be based on sales)
        this.bestSellers = products
          .filter(p => p.category === ProductCategory.TOPS || p.category === ProductCategory.BOTTOMS)
          .slice(0, 8);

        this.isLoading = false;
        console.log('Home component data loaded successfully');
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Có lỗi xảy ra khi tải dữ liệu';
        this.isLoading = false;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getCategoryDisplayName(category: ProductCategory): string {
    switch (category) {
      case ProductCategory.TOPS: return 'Áo Nam';
      case ProductCategory.BOTTOMS: return 'Quần Nam';
      case ProductCategory.OUTERWEAR: return 'Áo Khoác';
      case ProductCategory.ACCESSORIES: return 'Phụ Kiện';
      default: return category;
    }
  }
}
