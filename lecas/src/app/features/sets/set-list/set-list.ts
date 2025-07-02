import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SetCard } from '../set-card/set-card';

interface SetIncludedProduct {
    id: number;
    name: string;
    image: string;
    color: string | string[]; // Can be single string or array of strings
    size: string | string[];   // Can be single string or array of strings
}

interface Set {
    id: number;
    name: string;
    description: string;
    image: string;
    products: SetIncludedProduct[];
    price: number;
    // Add other properties if needed for sorting/filtering, e.g., category, createdAt, rating
    category?: string; // Example for category filter
    createdAt?: string; // Example for sorting by date
    rating?: number; // Example for sorting by rating
}

@Component({
    selector: 'app-set-list',
    standalone: true,
    imports: [CommonModule, RouterLink, SetCard, FormsModule],
    templateUrl: './set-list.html',
    styleUrls: ['./set-list.scss']
})
export class SetList implements OnInit {
    sets: Set[] = [
        {
            id: 1,
            name: 'Set Đồ Basic Monochrome',
            description: 'Áo thun + Quần jeans + Giày sneakers',
            image: '/assets/sets/set1.jpg',
            products: [
                { id: 101, name: 'Áo thun trắng', image: '/assets/products/tee-white.jpg', color: 'Trắng', size: 'M' },
                { id: 102, name: 'Quần jeans xanh', image: '/assets/products/jeans-blue.jpg', color: 'Xanh', size: '32' },
                { id: 103, name: 'Giày sneakers đen', image: '/assets/products/sneaker-black.jpg', color: 'Đen', size: '42' }
            ],
            price: 1199000,
            category: 'basic',
            createdAt: '2023-01-15T10:00:00Z',
            rating: 4.5
        },
        {
            id: 2,
            name: 'Set Đồ Năng Động',
            description: 'Áo polo + Quần short + Giày thể thao',
            image: '/assets/sets/set2.jpg',
            products: [
                { id: 104, name: 'Áo polo đen', image: '/assets/products/polo-black.jpg', color: 'Đen', size: 'L' },
                { id: 105, name: 'Quần short xám', image: '/assets/products/short-grey.jpg', color: 'Xám', size: '30' },
                { id: 106, name: 'Giày thể thao trắng', image: '/assets/products/sport-white.jpg', color: 'Trắng', size: '41' }
            ],
            price: 990000,
            category: 'sporty',
            createdAt: '2023-02-20T12:30:00Z',
            rating: 4.2
        }
    ];
    filteredSets: Set[] = [];
    isLoading = false;
    searchTerm = '';
    selectedCategory = '';
    selectedSort = 'name';
    sortOrder: 'asc' | 'desc' = 'asc';
    showFilters = false;

    categories = [
        { value: '', label: 'Tất cả' },
        { value: 'basic', label: 'Set Cơ Bản' },
        { value: 'sporty', label: 'Set Năng Động' }
    ];

    sortOptions = [
        { value: 'name', label: 'Tên Set' },
        { value: 'price', label: 'Giá' },
        { value: 'rating', label: 'Đánh giá' },
        { value: 'createdAt', label: 'Mới nhất' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadSets();
        this.loadQueryParams();
    }

    loadSets(): void {
        this.isLoading = true;
        // Simulate API call delay
        setTimeout(() => {
            this.applyFilters();
            this.isLoading = false;
        }, 500);
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
        let filtered = [...this.sets];

        // Apply search filter
        if (this.searchTerm.trim()) {
            const search = this.searchTerm.toLowerCase();
            filtered = filtered.filter(set =>
                set.name.toLowerCase().includes(search) ||
                set.description.toLowerCase().includes(search)
            );
        }

        // Apply category filter
        if (this.selectedCategory) {
            filtered = filtered.filter(set => set.category === this.selectedCategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any = a[this.selectedSort as keyof Set];
            let bValue: any = b[this.selectedSort as keyof Set];

            if (this.selectedSort === 'price') {
                aValue = a.price;
                bValue = b.price;
            } else if (this.selectedSort === 'createdAt') {
                aValue = new Date(a.createdAt!).getTime();
                bValue = new Date(b.createdAt!).getTime();
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

        this.filteredSets = filtered;
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
} 