import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Product, SearchSuggestion } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(private httpService: HttpService) { }

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
} 