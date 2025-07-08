export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    categoryId: string;
    category?: Category;
    specifications?: any;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductFilter {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'date';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface SearchSuggestion {
    id: string;
    name: string;
    type: 'product' | 'category';
}

export enum ProductCategory {
    TOPS = 'tops',
    BOTTOMS = 'bottoms',
    OUTERWEAR = 'outerwear',
    ACCESSORIES = 'accessories'
}

export interface ProductColor {
    name: string;
    code: string;
    available: boolean;
} 