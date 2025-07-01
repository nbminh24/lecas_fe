import { Product } from './product.interface';

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    price: number;
}

export interface Cart {
    id: string;
    userId?: string;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartSummary {
    totalItems: number;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
} 