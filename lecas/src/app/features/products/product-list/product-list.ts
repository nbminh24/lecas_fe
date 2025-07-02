import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product, ProductCategory } from '../../../core/models/product.interface';
import { ProductCard } from '../../../shared/product-card/product-card';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

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
  isLoading = false;
  searchTerm = '';
  selectedCategory = '';
  selectedSort = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  showFilters = false;
  currentPage = 1;
  pageSize = 40;

  categories = [
    { value: '', label: 'Tất cả' },
    { value: ProductCategory.TOPS, label: 'Áo Nam' },
    { value: ProductCategory.BOTTOMS, label: 'Quần Nam' },
    { value: ProductCategory.OUTERWEAR, label: 'Áo Khoác' }
  ];

  sortOptions = [
    { value: 'name', label: 'Tên sản phẩm' },
    { value: 'price', label: 'Giá' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'createdAt', label: 'Mới nhất' }
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadQueryParams();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter(p => p.category !== ProductCategory.ACCESSORIES);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  loadQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.subCategory.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply sorting
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
  }

  onSearchChange(): void {
    this.applyFilters();
    this.updateQueryParams();
  }

  onCategoryChange(): void {
    this.applyFilters();
    this.updateQueryParams();
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
    this.selectedCategory = '';
    this.selectedSort = 'name';
    this.sortOrder = 'asc';
    this.applyFilters();
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const params: any = {};
    if (this.selectedCategory) params.category = this.selectedCategory;
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
}
