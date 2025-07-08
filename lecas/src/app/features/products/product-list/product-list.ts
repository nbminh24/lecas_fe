import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product, ProductCategory, Category } from '../../../core/models/product.interface';
import { ProductCard } from '../../../shared/product-card/product-card';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CategoryService } from '../../../core/services/category.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard, PaginationComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategories: string[] = [];
  selectedSort = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  showFilters = false;
  currentPage = 1;
  pageSize = 40;

  categories: { value: string; label: string }[] = [
    { value: '', label: 'Tất cả' }
  ];
  isLoadingCategories = true;
  errorCategories: string | null = null;

  sortOptions = [
    { value: 'name', label: 'Tên sản phẩm' },
    { value: 'price', label: 'Giá' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'createdAt', label: 'Mới nhất' }
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadCategories();
        this.loadProducts();
        this.loadQueryParams();
      });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadCategories();
    this.loadProducts();
    this.loadQueryParams();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter(p => p.category?.id !== ProductCategory.ACCESSORIES);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.filteredProducts = [];
        this.isLoading = false;
      }
    });
  }

  loadQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      this.isLoading = true;
      if (params['category']) {
        this.selectedCategories = params['category'].split(',');
      }
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      this.applyFilters();
    });
  }

  applyFilters(): void {
    if (this.selectedCategories.length === 0) {
      let filtered = [...this.products];
      if (this.searchTerm.trim()) {
        const search = this.searchTerm.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.category?.name.toLowerCase().includes(search)
        );
      }
      filtered.sort((a, b) => {
        let aValue: any = a[this.selectedSort as keyof Product];
        let bValue: any = b[this.selectedSort as keyof Product];
        if (this.selectedSort === 'price') {
          aValue = a.price;
          bValue = b.price;
        } else if (this.selectedSort === 'createdAt') {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        }
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (this.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      this.filteredProducts = filtered;
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    const allProducts: Product[] = [];
    let loadedCount = 0;
    const uniqueProductIds = new Set<string>();
    this.filteredProducts = [];
    this.products = [];
    this.selectedCategories.forEach(categoryId => {
      this.productService.getCategoryProducts(categoryId).subscribe({
        next: (products: Product[]) => {
          products.forEach(product => {
            if (!uniqueProductIds.has(product.id)) {
              uniqueProductIds.add(product.id);
              allProducts.push(product);
            }
          });
          loadedCount++;
          if (loadedCount === this.selectedCategories.length) {
            this.products = allProducts;
            this.filteredProducts = allProducts;
            this.isLoading = false;
          }
        },
        error: (error: any) => {
          console.error('Error loading products for category', categoryId, error);
          loadedCount++;
          if (loadedCount === this.selectedCategories.length) {
            this.products = allProducts;
            this.filteredProducts = allProducts;
            this.isLoading = false;
          }
        }
      });
    });
  }

  onSearchChange(): void {
    this.applyFilters();
    this.updateQueryParams();
  }

  onCategoryChange(categoryValue: string): void {
    if (categoryValue === '') {
      this.selectedCategories = this.categories.filter(c => c.value !== '').map(c => c.value);
    } else {
      const idx = this.selectedCategories.indexOf(categoryValue);
      if (idx > -1) {
        this.selectedCategories.splice(idx, 1);
      } else {
        this.selectedCategories.push(categoryValue);
      }
      const allCategoryIds = this.categories.filter(c => c.value !== '').map(c => c.value);
      if (this.selectedCategories.length === allCategoryIds.length) {
        this.selectedCategories = [...allCategoryIds];
      }
    }
    this.applyFilters();
    this.updateQueryParams();
    setTimeout(() => { window.location.href = this.router.url; }, 0);
  }

  isAllCategoriesSelected(): boolean {
    const allCategoryIds = this.categories.filter(c => c.value !== '').map(c => c.value);
    return this.selectedCategories.length === allCategoryIds.length;
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategories = [];
    this.selectedSort = 'name';
    this.sortOrder = 'asc';
    this.applyFilters();
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const params: any = {};
    if (this.selectedCategories.length > 0) params.category = this.selectedCategories.join(',');
    if (this.searchTerm) params.search = this.searchTerm;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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

  get pagedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.errorCategories = null;
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = [
          { value: '', label: 'Tất cả' },
          ...categories.map(cat => ({ value: cat.id, label: cat.name }))
        ];
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorCategories = 'Có lỗi khi tải danh mục';
        this.isLoadingCategories = false;
      }
    });
  }
}
