export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: ProductCategory;
    subCategory: string;
    sizes: string[];
    colors: ProductColor[];
    inStock: boolean;
    rating: number;
    reviewCount: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
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

export interface ProductFilter {
    category?: ProductCategory;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
    sortBy?: 'price' | 'name' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
} 