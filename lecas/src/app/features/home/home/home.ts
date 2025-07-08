import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product, ProductCategory, Category } from '../../../core/models/product.interface';
import { ProductCard } from '../../../shared/product-card/product-card';
import { filter } from 'rxjs/operators';
import { CategoryService } from '../../../core/services/category.service';

interface FeaturedCategory {
  id: string;
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
  featuredCategories: FeaturedCategory[] = [];
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  bestSellers: Product[] = [];
  isLoading = true;
  error: string | null = null;
  noFeaturedProducts = false;
  noNewArrivals = false;
  noBestSellers = false;
  isLoadingCategories = true;
  errorCategories: string | null = null;

  constructor(private productService: ProductService, private categoryService: CategoryService, private router: Router) {
    console.log('Home component constructor called');
    // Lắng nghe sự kiện chuyển route để reload data khi quay lại Home
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/' || event.url === '/') {
          this.loadProducts();
          this.loadCategories();
        }
      });
  }

  ngOnInit(): void {
    console.log('Home component ngOnInit called');
    this.loadProducts();
    this.loadCategories();
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
        this.noFeaturedProducts = this.featuredProducts.length === 0;

        // New arrivals (recently added)
        this.newArrivals = products
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);
        this.noNewArrivals = this.newArrivals.length === 0;

        // Best sellers (mock data - could be based on sales)
        this.bestSellers = products
          .filter(p => p.category?.id === 'TOPS' || p.category?.id === 'BOTTOMS')
          .slice(0, 8);
        this.noBestSellers = this.bestSellers.length === 0;

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

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.errorCategories = null;
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.featuredCategories = categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          image: cat.imageUrl || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(cat.name),
          link: `/products?category=${cat.id}`,
          description: cat.description || ''
        }));
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorCategories = 'Có lỗi khi tải danh mục sản phẩm';
        this.isLoadingCategories = false;
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

  retryLoadProducts(): void {
    console.log('Retry button clicked! Resetting state...');
    this.error = null;
    this.isLoading = true;
    this.featuredProducts = [];
    this.newArrivals = [];
    this.bestSellers = [];
    this.noFeaturedProducts = false;
    this.noNewArrivals = false;
    this.noBestSellers = false;
    this.loadProducts();
  }

  goToCategory(category: FeaturedCategory) {
    this.router.navigate(['/products'], { queryParams: { category: category.id } }).then(() => {
      window.location.reload();
    });
  }
}
