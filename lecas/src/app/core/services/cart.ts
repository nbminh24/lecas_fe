import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, CartSummary } from '../models/cart.interface';
import { Product } from '../models/product.interface';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);

  private cartSubject = new BehaviorSubject<Cart>({
    id: '1',
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromStorage();
    }
  }

  private loadCartFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedCart = localStorage.getItem('lecas-cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        cart.createdAt = new Date(cart.createdAt);
        cart.updatedAt = new Date(cart.updatedAt);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(cart: Cart): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('lecas-cart', JSON.stringify(cart));
  }

  addToCart(product: Product, quantity: number = 1, size: string, color: string): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      item => item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      currentCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now().toString(),
        product,
        quantity,
        selectedSize: size,
        selectedColor: color,
        price: product.price
      };
      currentCart.items.push(newItem);
    }

    this.updateCart(currentCart);
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        currentCart.items.splice(itemIndex, 1);
      } else {
        currentCart.items[itemIndex].quantity = quantity;
      }
      this.updateCart(currentCart);
    }
  }

  removeFromCart(itemId: string): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    this.updateCart(currentCart);
  }

  clearCart(): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = [];
    this.updateCart(currentCart);
  }

  private updateCart(cart: Cart): void {
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.shipping = cart.subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
    cart.tax = Math.round(cart.subtotal * 0.1); // 10% tax
    cart.total = cart.subtotal + cart.shipping + cart.tax;
    cart.updatedAt = new Date();

    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  getCartSummary(): Observable<CartSummary> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next({
          totalItems: cart.totalItems,
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          total: cart.total
        });
      });
    });
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart.totalItems);
      });
    });
  }
}
