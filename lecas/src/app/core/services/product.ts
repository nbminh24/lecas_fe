import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Product, Category, ProductFilter, Review, SearchSuggestion } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpService: HttpService) { }

  getProducts(filter?: ProductFilter): Observable<Product[]> {
    return this.httpService.get<Product[]>('/products', filter).pipe(
      map(response => response.data || [])
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.httpService.get<Product>(`/products/${id}`).pipe(
      map(response => response.data!)
    );
  }

  getCategories(): Observable<Category[]> {
    return this.httpService.get<Category[]>('/products/categories').pipe(
      map(response => response.data || [])
    );
  }

  getProductReviews(productId: string): Observable<Review[]> {
    return this.httpService.get<Review[]>(`/products/${productId}/reviews`).pipe(
      map(response => response.data || [])
    );
  }

  getRelatedProducts(productId: string): Observable<Product[]> {
    return this.httpService.get<Product[]>(`/products/${productId}/related`).pipe(
      map(response => response.data || [])
    );
  }

  getTopSellingProducts(): Observable<Product[]> {
    return this.httpService.get<Product[]>('/products/top-selling').pipe(
      map(response => response.data || [])
    );
  }

  getFlashSaleProducts(): Observable<Product[]> {
    return this.httpService.get<Product[]>('/products/flash-sale').pipe(
      map(response => response.data || [])
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.httpService.get<Product[]>('/search/products', { keyword }).pipe(
      map(response => response.data || [])
    );
  }

  getSearchSuggestions(keyword: string): Observable<SearchSuggestion[]> {
    return this.httpService.get<SearchSuggestion[]>('/search/suggestions', { keyword }).pipe(
      map(response => response.data || [])
    );
  }

  // Admin methods
  createProduct(productData: any): Observable<Product> {
    return this.httpService.post<Product>('/products', productData).pipe(
      map(response => response.data!)
    );
  }

  updateProduct(id: string, productData: any): Observable<Product> {
    return this.httpService.put<Product>(`/products/${id}`, productData).pipe(
      map(response => response.data!)
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpService.delete(`/products/${id}`);
  }
}
