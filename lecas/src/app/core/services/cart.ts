import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Cart, CartItem, CartSummary, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.interface';
import { HttpService } from './http.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private httpService = inject(HttpService);
  private auth = inject(Auth);

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  private loadCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.auth.isAuthenticated()) {
      // Nếu chưa đăng nhập, khởi tạo giỏ hàng rỗng
      this.cartSubject.next({
        id: '',
        userId: '',
        items: [],
        totalItems: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return;
    }
    this.httpService.get<Cart>('/cart').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.cartSubject.next(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        // Initialize empty cart if not found
        this.cartSubject.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
  }

  getCart() {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        observer.complete();
      });
    }
    return this.httpService.get<Cart>('/cart').pipe(
      map(response => response.data!)
    );
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        observer.complete();
      });
    }
    return this.httpService.post<Cart>('/cart/items', request).pipe(
      map(response => response.data!)
    );
  }

  updateItemQuantity(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        observer.complete();
      });
    }
    return this.httpService.put<Cart>(`/cart/items/${itemId}`, request).pipe(
      map(response => response.data!)
    );
  }

  removeFromCart(itemId: string): Observable<Cart> {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        observer.complete();
      });
    }
    return this.httpService.delete<Cart>(`/cart/items/${itemId}`).pipe(
      map(response => response.data!)
    );
  }

  clearCart(): Observable<any> {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        observer.complete();
      });
    }
    return this.httpService.delete('/cart').pipe(
      tap(() => {
        this.cartSubject.next({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      })
    );
  }

  getCartSummary(): Observable<CartSummary> {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next({
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0
        });
        observer.complete();
      });
    }
    return this.httpService.get<CartSummary>('/cart/summary').pipe(
      map(response => response.data!)
    );
  }

  getCartItemCount(): Observable<number> {
    if (!this.auth.isAuthenticated()) {
      return new Observable(observer => {
        observer.next(0);
        observer.complete();
      });
    }
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart?.totalItems || 0);
      });
    });
  }
}
