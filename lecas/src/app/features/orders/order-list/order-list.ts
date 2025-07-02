import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

interface OrderProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

interface OrderTracking {
  status: string;
  location: string;
  time: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  payment: string;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  products: OrderProduct[];
  tracking: OrderTracking[];
  canReview?: boolean;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent]
})
export class OrderList {
  tabs = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang xử lý', value: 'processing' },
    { label: 'Đang giao', value: 'shipping' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' }
  ];
  selectedTab = 'all';
  searchTerm = '';
  showDetail: Order | null = null;
  showReviewModal = false;
  reviewOrderProducts: OrderProduct[] = [];
  reviewOrderId: string | null = null;
  reviewData: { [productId: number]: { rating: number, comment: string, imageUrl?: string } } = {};
  currentPage = 1;
  pageSize = 20;

  orders: Order[] = [
    {
      id: 'OD123456789',
      createdAt: '2024-07-01T14:30:00',
      status: 'delivered',
      total: 1151700,
      payment: 'Thanh toán khi nhận hàng',
      shippingInfo: {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        note: 'Giao giờ hành chính'
      },
      products: [
        { id: 1, name: 'Áo Polo Nam Casual', image: '/assets/products/polo-black.jpg', price: 299000, quantity: 1, color: 'Đen', size: 'L' },
        { id: 2, name: 'Áo Sơ Mi Nam Cổ Bẻ', image: '/assets/products/tee-white.jpg', price: 399000, quantity: 1, color: 'Trắng', size: 'S' },
        { id: 3, name: 'Quần Khaki Nam', image: '/assets/products/jeans-blue.jpg', price: 349000, quantity: 1, color: 'Khaki', size: '28' }
      ],
      tracking: [
        { status: 'Đã đặt hàng', location: 'Online', time: '01/07/2024 14:30' },
        { status: 'Đã xác nhận', location: 'LeCas Shop', time: '01/07/2024 15:00' },
        { status: 'Đã xuất kho', location: 'Kho LeCas', time: '01/07/2024 18:00' },
        { status: 'Đã đến bưu cục A', location: 'Bưu cục Quận 1', time: '02/07/2024 08:30' },
        { status: 'Đang giao', location: 'TP.HCM', time: '02/07/2024 10:00' },
        { status: 'Đã giao thành công', location: '123 Đường ABC', time: '02/07/2024 12:00' }
      ],
      canReview: true
    },
    {
      id: 'OD987654321',
      createdAt: '2024-07-02T09:00:00',
      status: 'shipping',
      total: 499000,
      payment: 'Ví MoMo',
      shippingInfo: {
        name: 'Nguyễn Văn B',
        phone: '0909876543',
        address: '456 Đường XYZ, Quận 3, TP.HCM'
      },
      products: [
        { id: 4, name: 'Áo Thun Basic', image: '/assets/products/tee-white.jpg', price: 249000, quantity: 2, color: 'Trắng', size: 'M' }
      ],
      tracking: [
        { status: 'Đã đặt hàng', location: 'Online', time: '02/07/2024 09:00' },
        { status: 'Đã xác nhận', location: 'LeCas Shop', time: '02/07/2024 09:30' },
        { status: 'Đã xuất kho', location: 'Kho LeCas', time: '02/07/2024 12:00' },
        { status: 'Đã đến bưu cục B', location: 'Bưu cục Quận 3', time: '02/07/2024 15:00' },
        { status: 'Đang giao', location: 'TP.HCM', time: '02/07/2024 16:00' }
      ]
    },
    {
      id: 'OD555555555',
      createdAt: '2024-06-28T10:00:00',
      status: 'cancelled',
      total: 299000,
      payment: 'ZaloPay',
      shippingInfo: {
        name: 'Nguyễn Văn C',
        phone: '0905555555',
        address: '789 Đường DEF, Quận 5, TP.HCM',
        note: 'Giao buổi sáng'
      },
      products: [
        { id: 5, name: 'Áo Polo Nam', image: '/assets/products/polo-black.jpg', price: 299000, quantity: 1, color: 'Đen', size: 'M' }
      ],
      tracking: [
        { status: 'Đã đặt hàng', location: 'Online', time: '28/06/2024 10:00' },
        { status: 'Đã xác nhận', location: 'LeCas Shop', time: '28/06/2024 10:30' },
        { status: 'Đã hủy', location: 'LeCas Shop', time: '28/06/2024 11:00' }
      ]
    }
  ];

  get filteredOrders() {
    let filtered = this.orders;
    if (this.selectedTab !== 'all') {
      filtered = filtered.filter(o => o.status === this.selectedTab);
    }
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(search) ||
        o.products.some(p => p.name.toLowerCase().includes(search))
      );
    }
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get pagedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  openDetail(order: Order) {
    this.showDetail = order;
  }

  closeDetail() {
    this.showDetail = null;
  }

  contactSupport(order: Order | null) {
    if (!order) return;
    window.open('tel:19001234');
  }

  reviewOrder(order: Order | null) {
    if (!order) return;
    this.reviewOrderProducts = order.products;
    this.reviewOrderId = order.id;
    this.showReviewModal = true;
    this.reviewData = {};
    for (const p of order.products) {
      this.reviewData[p.id] = { rating: 5, comment: '', imageUrl: undefined };
    }
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.reviewOrderProducts = [];
    this.reviewOrderId = null;
  }

  submitReview() {
    alert('Đã gửi đánh giá!\n' + JSON.stringify(this.reviewData, null, 2));
    this.closeReviewModal();
    const order = this.orders.find(o => o.id === this.reviewOrderId);
    if (order) order.canReview = false;
  }

  getStatusLabel(status: string | undefined | null): string {
    if (!status) return 'Khác';
    const found = this.tabs.find(t => t.value === status);
    return found ? found.label : 'Khác';
  }

  getProductNames(order: Order): string {
    return order.products.map(p => p.name).join(', ');
  }

  onAttachImage(event: Event, productId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (!this.reviewData[productId]) return;
        this.reviewData[productId].imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
