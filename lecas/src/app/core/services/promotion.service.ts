import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

export interface Promotion {
    id: string;
    name: string;
    description: string;
    discountPercent: number;
    startDate: Date;
    endDate: Date;
    productIds: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PromotionService {
    constructor(private httpService: HttpService) { }

    getActivePromotions(): Observable<Promotion[]> {
        return this.httpService.get<Promotion[]>('/promotions/active').pipe(
            map(response => response.data || [])
        );
    }

    // Admin methods
    getAllPromotions(): Observable<Promotion[]> {
        return this.httpService.get<Promotion[]>('/promotions').pipe(
            map(response => response.data || [])
        );
    }

    getPromotion(id: string): Observable<Promotion> {
        return this.httpService.get<Promotion>(`/promotions/${id}`).pipe(
            map(response => response.data!)
        );
    }

    createPromotion(promotionData: any): Observable<Promotion> {
        return this.httpService.post<Promotion>('/promotions', promotionData).pipe(
            map(response => response.data!)
        );
    }

    updatePromotion(id: string, promotionData: any): Observable<Promotion> {
        return this.httpService.put<Promotion>(`/promotions/${id}`, promotionData).pipe(
            map(response => response.data!)
        );
    }

    deletePromotion(id: string): Observable<any> {
        return this.httpService.delete(`/promotions/${id}`);
    }
} 