import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Product, Category } from '../models/product.interface';

export interface HomeStats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalUsers: number;
}

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private httpService: HttpService) { }

    getFeaturedProducts(): Observable<Product[]> {
        return this.httpService.get<Product[]>('/home/featured-products').pipe(
            map(response => response.data || [])
        );
    }

    getFlashSale(): Observable<Product[]> {
        return this.httpService.get<Product[]>('/home/flash-sale').pipe(
            map(response => response.data || [])
        );
    }

    getCategories(): Observable<Category[]> {
        return this.httpService.get<Category[]>('/home/categories').pipe(
            map(response => response.data || [])
        );
    }

    getStats(): Observable<HomeStats> {
        return this.httpService.get<HomeStats>('/home/stats').pipe(
            map(response => response.data!)
        );
    }
} 