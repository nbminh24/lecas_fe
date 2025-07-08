import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private cartService = inject(CartService);
  private auth = inject(Auth);
  cartItemCount$ = this.cartService.getCartItemCount();

  isLoggedIn = false;
  user: any = null;

  constructor() {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  reloadHome(event: Event) {
    event.preventDefault();
    window.location.href = '/';
  }

  reloadNav(event: Event, url: string) {
    event.preventDefault();
    window.location.href = url;
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        window.location.href = '/';
      },
      error: () => {
        window.location.href = '/';
      }
    });
  }
}
