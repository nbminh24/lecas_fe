import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { Cart, CartItem, CartSummary, UpdateCartItemRequest } from '../../../core/models/cart.interface';
import { Observable, Subscription, take } from 'rxjs';
import { ShopServiceFeaturesComponent } from '../../../shared/product-features/shop-service-features.component';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CreateOrderRequest, Address } from '../../../core/models/order.interface';
import { ToastService } from '../../../app';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../core/services/http.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopServiceFeaturesComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  // Thông tin nhận hàng
  customer = {
    name: '',
    phone: '',
    address: '',
    note: ''
  };

  // Phương thức thanh toán
  paymentMethod: 'vnpay' | 'momo' | 'cod' = 'vnpay';
  paymentMethods = [
    {
      value: 'vnpay',
      label: 'VNPay',
      icon: 'assets/payment/ZaloPay.png',
      description: 'Thanh toán qua VNPay (ATM, Visa, QR)'
    },
    {
      value: 'momo',
      label: 'Momo',
      icon: 'assets/payment/MoMo.png',
      description: 'Thanh toán qua ví điện tử Momo'
    },
    {
      value: 'cod',
      label: 'Tiền mặt',
      icon: 'assets/payment/COD.png',
      description: 'Thanh toán khi nhận hàng (COD)'
    }
  ];

  isSubmitting = false;
  isCartLoading = true;
  cartError: string | null = null;
  private cartSub: Subscription | null = null;
  buyNowProduct: any = null;
  buyNowQuantity: number = 1;
  buyNowSize: string = '';
  buyNowColor: string = '';
  addresses: any[] = [];
  selectedAddressId: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private httpService: HttpService
  ) { }

  get cart$() {
    return this.cartService.cart$;
  }
  get cartSummary$() {
    return this.cartService.getCartSummary();
  }

  ngOnInit() {
    const nav = window.history.state;
    if (nav && nav.buyNow && nav.product) {
      this.buyNowProduct = nav.product;
      this.buyNowQuantity = nav.quantity || 1;
      this.buyNowSize = nav.size || '';
      this.buyNowColor = nav.color || '';
      this.isCartLoading = false;
      this.cartError = null;
      // Không subscribe cart$ khi mua nhanh
    } else {
      this.cartSub = this.cartService.cart$.subscribe({
        next: (cart) => {
          this.isCartLoading = false;
          this.cartError = null;
          if (!cart) {
            this.cartError = 'Không lấy được giỏ hàng. Vui lòng thử lại.';
          } else if (!cart.items || cart.items.length === 0) {
            // Không có sản phẩm, vẫn cho phép hiển thị UI nhưng có thể cảnh báo
          }
        },
        error: (err) => {
          this.isCartLoading = false;
          this.cartError = 'Lỗi khi tải giỏ hàng: ' + (err?.message || err);
        }
      });
    }
    // Lấy danh sách địa chỉ
    this.httpService.get<any>('/Users/addresses').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.addresses = res.data;
          // Nếu có địa chỉ mặc định, tự động chọn
          const def = this.addresses.find(a => a.isDefault);
          if (def) {
            this.selectedAddressId = def.id;
            this.fillAddress(def);
          }
        }
      },
      error: () => {
        this.addresses = [];
      }
    });
    // Nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
    if (!this.cartService['auth'].isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // Chỉ unsubscribe nếu có cartSub
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  submitOrder() {
    this.isSubmitting = true;
    if (this.buyNowProduct) {
      // Mua nhanh 1 sản phẩm
      const shippingInfo = {
        name: this.customer.name,
        phone: this.customer.phone,
        address: this.customer.address,
        city: '',
        district: '',
        note: this.customer.note || ''
      };
      const request = {
        shippingInfo,
        paymentMethod: this.paymentMethod as any,
        note: this.customer.note || '',
        items: [
          {
            productId: this.buyNowProduct.id,
            quantity: this.buyNowQuantity,
            size: this.buyNowSize,
            color: this.buyNowColor
          }
        ]
      };
      this.orderService.createOrder(request).subscribe({
        next: (order) => {
          this.toast.show('Đặt hàng thành công! Mã đơn: ' + order.id, 'success');
          this.isSubmitting = false;
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.toast.show('Đặt hàng thất bại!', 'error');
          this.isSubmitting = false;
        }
      });
      return;
    }
    this.cartService.cart$.pipe(take(1)).subscribe(cart => {
      if (!cart || !cart.items.length) {
        this.toast.show('Giỏ hàng trống!', 'error');
        this.isSubmitting = false;
        return;
      }
      // Map shippingInfo cho giỏ hàng
      const shippingInfo = {
        name: this.customer.name,
        phone: this.customer.phone,
        address: this.customer.address,
        city: '',
        district: '',
        note: this.customer.note || ''
      };
      const request = {
        shippingInfo,
        paymentMethod: this.paymentMethod as any,
        note: this.customer.note || ''
      };
      // Mock thanh toán nếu không phải COD
      if (this.paymentMethod !== 'cod') {
        setTimeout(() => {
          // Giả lập thành công
          this.orderService.createOrder(request).subscribe({
            next: (order) => {
              this.toast.show('Đặt hàng thành công! Mã đơn: ' + order.id + ' (Thanh toán mock)', 'success');
              this.isSubmitting = false;
              this.cartService.clearCart().subscribe({ complete: () => { } });
              this.router.navigate(['/orders']);
            },
            error: (err) => {
              this.toast.show('Đặt hàng thất bại!', 'error');
              this.isSubmitting = false;
            }
          });
        }, 1200); // Giả lập delay thanh toán
      } else {
        this.orderService.createOrder(request).subscribe({
          next: (order) => {
            this.toast.show('Đặt hàng thành công! Mã đơn: ' + order.id, 'success');
            this.isSubmitting = false;
            this.cartService.clearCart().subscribe({ complete: () => { } });
            this.router.navigate(['/orders']);
          },
          error: (err) => {
            this.toast.show('Đặt hàng thất bại!', 'error');
            this.isSubmitting = false;
          }
        });
      }
    });
  }

  updateQuantity(item: CartItem) {
    const request: UpdateCartItemRequest = {
      quantity: item.quantity
    };
    this.cartService.updateItemQuantity(item.id, request).subscribe({
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const request: UpdateCartItemRequest = {
        quantity: item.quantity - 1
      };
      this.cartService.updateItemQuantity(item.id, request).subscribe({
        error: (error) => {
          console.error('Error updating quantity:', error);
        }
      });
    }
  }

  increaseQuantity(item: CartItem) {
    const request: UpdateCartItemRequest = {
      quantity: item.quantity + 1
    };
    this.cartService.updateItemQuantity(item.id, request).subscribe({
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id).subscribe({
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  fillAddress(addr: any) {
    this.customer.name = addr.name;
    this.customer.phone = addr.phone;
    this.customer.address = addr.addressLine;
    // city, district nếu muốn dùng
    this.customer.note = addr.note || '';
  }

  onSelectAddress(id: string) {
    const addr = this.addresses.find((a) => a.id === id);
    if (addr) this.fillAddress(addr);
  }
}
