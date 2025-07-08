import { Product } from './product.interface';

export interface CartItem {
    id: string;
    productId: string;
    product: CartProduct;
    quantity: number;
    price: number;
}

export interface Cart {
    id: string;
    userId: string;
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

export interface AddToCartRequest {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface CartProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
} 