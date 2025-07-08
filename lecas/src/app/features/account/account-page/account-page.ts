import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-account-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './account-page.html',
    styleUrl: './account-page.scss'
})
export class AccountPageComponent {
    menu = [
        { key: 'profile', label: 'Thông tin cá nhân', icon: 'fas fa-user' },
        { key: 'password', label: 'Đổi mật khẩu', icon: 'fas fa-lock' },
        { key: 'orders', label: 'Đơn hàng', icon: 'fas fa-box' },
        { key: 'address', label: 'Địa chỉ giao hàng', icon: 'fas fa-map-marker-alt' },
        { key: 'voucher', label: 'Voucher đã lưu', icon: 'fas fa-ticket-alt' }
    ];
    selected = 'profile';
    user = {
        name: 'Nguyễn Văn A',
        email: 'user@email.com',
        phone: '0901234567',
        avatar: '/assets/avatar-default.png'
    };
    selectMenu(key: string) {
        this.selected = key;
    }
} 