export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: 'cod' | 'momo' | 'zalopay';
    status: OrderStatus;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    note?: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    productId: string;
    product: OrderProduct;
    quantity: number;
    price: number;
}

export interface OrderProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
}

export interface Address {
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    district: string;
    ward: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export interface CreateOrderRequest {
    shippingInfo: {
        name: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        note?: string;
    };
    paymentMethod: 'cod' | 'momo' | 'zalopay';
    note?: string;
    items?: Array<{
        productId: string;
        quantity: number;
        size?: string;
        color?: string;
    }>;
}

export interface CancelOrderRequest {
    reason: string;
}

export interface OrderTracking {
    id: string;
    orderId: string;
    status: OrderStatus;
    description: string;
    location?: string;
    createdAt: Date;
}

export interface CreateReviewRequest {
    rating: number;
    comment: string;
}

export interface OrderFilter {
    status?: OrderStatus;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
} 