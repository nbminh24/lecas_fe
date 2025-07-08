import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Array<{ field: string; message: string }>;
}

function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private readonly baseUrl = 'https://lecas-be.onrender.com/api';
    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    private getHeaders(): HttpHeaders {
        let token = '';
        if (isBrowser()) {
            token = localStorage.getItem('accessToken') || '';
        }
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        });
    }

    get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            params
        }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

    post<T>(endpoint: string, data?: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

    put<T>(endpoint: string, data?: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

    delete<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('API error:', error);

        if (error.status === 401 && !this.isRefreshing) {
            return this.handleTokenRefresh(error);
        }

        const errorMessage = error.error?.message || error.message || 'An error occurred';
        return throwError(() => new Error(errorMessage));
    }

    private handleTokenRefresh(error: HttpErrorResponse): Observable<never> {
        this.isRefreshing = true;
        let refreshToken = '';
        if (isBrowser()) {
            refreshToken = localStorage.getItem('refreshToken') || '';
        }

        if (!refreshToken) {
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }

        return this.http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${this.baseUrl}/auth/refresh-token`,
            { refreshToken }
        ).pipe(
            tap(response => {
                if (response.success && response.data) {
                    if (isBrowser()) {
                        localStorage.setItem('accessToken', response.data.accessToken);
                        localStorage.setItem('refreshToken', response.data.refreshToken);
                    }
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.data.accessToken);
                }
            }),
            catchError(refreshError => {
                this.isRefreshing = false;
                this.logout();
                return throwError(() => new Error('Token refresh failed'));
            }),
            // This ensures the observable type is Observable<never>
            switchMap(() => throwError(() => error))
        );
    }

    private logout(): void {
        if (isBrowser()) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
        this.router.navigate(['/login']);
    }

    getRefreshTokenSubject(): Observable<string | null> {
        return this.refreshTokenSubject.asObservable();
    }
} 