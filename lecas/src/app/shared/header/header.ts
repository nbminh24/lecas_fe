import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private cartService = inject(CartService);
  cartItemCount$ = this.cartService.getCartItemCount();
  isLoggedIn = true; // mock trạng thái đăng nhập
  user = {
    name: 'Nguyễn Văn A',
    avatar: '/assets/avatar-default.png',
    email: 'user@email.com'
  };
}
