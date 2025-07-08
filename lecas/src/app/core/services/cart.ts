import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Cart, CartItem, CartSummary, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.interface';
import { HttpService } from './http.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private httpService = inject(HttpService);

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  private loadCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.httpService.post<Cart>('/cart/items', request).pipe(
      map(response => response.data!),
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );
  }

  updateItemQuantity(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
    return this.httpService.put<Cart>(`/cart/items/${itemId}`, request).pipe(
      map(response => response.data!),
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );
  }

  removeFromCart(itemId: string): Observable<Cart> {
    return this.httpService.delete<Cart>(`/cart/items/${itemId}`).pipe(
      map(response => response.data!),
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );
  }

  clearCart(): Observable<any> {
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
    return this.httpService.get<CartSummary>('/cart/summary').pipe(
      map(response => response.data!)
    );
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart?.totalItems || 0);
      });
    });
  }
}
