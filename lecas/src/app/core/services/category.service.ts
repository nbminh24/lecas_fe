import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Category, Product } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private httpService: HttpService) { }

    getCategories(): Observable<Category[]> {
        return this.httpService.get<Category[]>('/categories').pipe(
            map(response => response.data || [])
        );
    }

    getCategory(id: string): Observable<Category> {
        return this.httpService.get<Category>(`/categories/${id}`).pipe(
            map(response => response.data!)
        );
    }

    getCategoryProducts(categoryId: string): Observable<Product[]> {
        return this.httpService.get<Product[]>(`/categories/${categoryId}/products`).pipe(
            map(response => response.data || [])
        );
    }

    // Admin methods
    createCategory(categoryData: any): Observable<Category> {
        return this.httpService.post<Category>('/categories', categoryData).pipe(
            map(response => response.data!)
        );
    }

    updateCategory(id: string, categoryData: any): Observable<Category> {
        return this.httpService.put<Category>(`/categories/${id}`, categoryData).pipe(
            map(response => response.data!)
        );
    }

    deleteCategory(id: string): Observable<any> {
        return this.httpService.delete(`/categories/${id}`);
    }
} 