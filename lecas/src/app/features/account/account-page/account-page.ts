import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { HttpService } from '../../../core/services/http.service';

@Component({
    selector: 'app-account-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './account-page.html',
    styleUrl: './account-page.scss'
})
export class AccountPageComponent {
    menu = [
        { key: 'profile', label: 'Thông tin cá nhân', icon: 'fas fa-user' },
        { key: 'password', label: 'Đổi mật khẩu', icon: 'fas fa-lock' },
        { key: 'address', label: 'Địa chỉ giao hàng', icon: 'fas fa-map-marker-alt' }
    ];
    selected = 'profile';
    user: any = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: ''
    };
    password = {
        currentPassword: '',
        newPassword: ''
    };
    newAddress: any = {
        name: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        note: '',
        isDefault: false
    };
    addresses: any[] = [];
    loading = true;
    error = '';
    successMsg = '';

    private httpService = inject(HttpService);
    private auth = inject(Auth);

    constructor() {
        if (typeof window !== 'undefined') {
            this.fetchUser();
            this.fetchAddresses();
        }
    }

    fetchUser() {
        this.loading = true;
        this.error = '';
        this.auth.getProfile().subscribe({
            next: (user) => {
                if (!user) {
                    this.error = 'Không thể tải thông tin người dùng.';
                    this.loading = false;
                    return;
                }
                this.user = {
                    ...this.user,
                    ...user
                };
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Không thể tải thông tin người dùng.';
                this.loading = false;
            }
        });
    }

    fetchAddresses() {
        // Nếu backend có API GET /api/Users/addresses thì dùng, nếu không thì bỏ qua
        this.httpService.get<any[]>('/Users/addresses').subscribe({
            next: (res: any) => {
                this.addresses = res.data || res || [];
            },
            error: () => {
                this.addresses = [];
            }
        });
    }

    onSaveProfile() {
        this.successMsg = '';
        this.error = '';
        const body = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            phoneNumber: this.user.phoneNumber,
            dateOfBirth: this.user.dateOfBirth,
            gender: this.user.gender
        };
        this.httpService.put('/Users/profile', body).subscribe({
            next: (res: any) => {
                this.successMsg = 'Cập nhật thành công!';
                this.fetchUser();
            },
            error: (err) => {
                this.error = 'Cập nhật thất bại!';
            }
        });
    }

    onChangePassword() {
        this.successMsg = '';
        this.error = '';
        const body = {
            currentPassword: this.password.currentPassword,
            newPassword: this.password.newPassword
        };
        this.httpService.post('/Users/change-password', body).subscribe({
            next: (res: any) => {
                this.successMsg = 'Đổi mật khẩu thành công!';
                this.password = { currentPassword: '', newPassword: '' };
            },
            error: (err) => {
                this.error = 'Đổi mật khẩu thất bại!';
            }
        });
    }

    onAddAddress() {
        this.successMsg = '';
        this.error = '';
        const body = { ...this.newAddress };
        this.httpService.post('/Users/addresses', body).subscribe({
            next: (res: any) => {
                this.successMsg = 'Thêm địa chỉ thành công!';
                this.newAddress = {
                    name: '',
                    phone: '',
                    address: '',
                    city: '',
                    district: '',
                    note: '',
                    isDefault: false
                };
                this.fetchAddresses();
            },
            error: (err) => {
                this.error = 'Thêm địa chỉ thất bại!';
            }
        });
    }

    onDeleteAddress(id: string) {
        this.successMsg = '';
        this.error = '';
        this.httpService.delete(`/Users/addresses/${id}`).subscribe({
            next: (res: any) => {
                this.successMsg = 'Xóa địa chỉ thành công!';
                this.fetchAddresses();
            },
            error: (err) => {
                this.error = 'Xóa địa chỉ thất bại!';
            }
        });
    }

    selectMenu(key: string) {
        this.selected = key;
        this.successMsg = '';
        this.error = '';
    }
} 