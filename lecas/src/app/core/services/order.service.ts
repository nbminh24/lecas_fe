import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import {
    Order,
    CreateOrderRequest,
    CancelOrderRequest,
    OrderTracking,
    CreateReviewRequest,
    OrderFilter
} from '../models/order.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private httpService: HttpService) { }

    createOrder(request: CreateOrderRequest): Observable<Order> {
        return this.httpService.post<Order>('/orders', request).pipe(
            map(response => response.data!)
        );
    }

    getOrders(filter?: OrderFilter): Observable<Order[]> {
        return this.httpService.get<Order[]>('/orders', filter).pipe(
            map(response => response.data || [])
        );
    }

    getOrder(id: string): Observable<Order> {
        return this.httpService.get<Order>(`/orders/${id}`).pipe(
            map(response => response.data!)
        );
    }

    cancelOrder(id: string, request: CancelOrderRequest): Observable<Order> {
        return this.httpService.put<Order>(`/orders/${id}/cancel`, request).pipe(
            map(response => response.data!)
        );
    }

    createReview(orderId: string, request: CreateReviewRequest): Observable<any> {
        return this.httpService.post(`/orders/${orderId}/reviews`, request);
    }

    getOrderTracking(orderId: string): Observable<OrderTracking[]> {
        return this.httpService.get<OrderTracking[]>(`/orders/${orderId}/tracking`).pipe(
            map(response => response.data || [])
        );
    }

    updateOrderInfo(orderId: string, updateData: any): Observable<Order> {
        return this.httpService.put<Order>(`/orders/${orderId}/update-info`, updateData).pipe(
            map(response => response.data!)
        );
    }

    // Admin methods
    updateOrderStatus(orderId: string, statusData: any): Observable<Order> {
        return this.httpService.put<Order>(`/orders/${orderId}/status`, statusData).pipe(
            map(response => response.data!)
        );
    }
} 