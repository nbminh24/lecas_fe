import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { OrderChatService } from '../../../core/services/order-chat.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order as ApiOrder, OrderStatus } from '../../../core/models/order.interface';

interface OrderProduct {
  id: string;
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
    { label: 'Đang xử lý', value: 'pending' },
    { label: 'Đang giao', value: 'shipped' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' }
  ];
  selectedTab = 'all';
  searchTerm = '';
  showDetail: Order | null = null;
  showReviewModal = false;
  reviewOrderProducts: OrderProduct[] = [];
  reviewOrderId: string | null = null;
  reviewData: { [productId: string]: { rating: number, comment: string, imageUrl?: string } } = {};
  currentPage = 1;
  pageSize = 20;
  orders: Order[] = [];
  loading = false;
  error: string | null = null;
  editShippingInfo: boolean = false;
  shippingInfoForm: { name: string; phone: string; address: string; note?: string } = { name: '', phone: '', address: '', note: '' };
  isAdmin: boolean = false; // TODO: set thực tế theo quyền user

  constructor(
    private orderChatService: OrderChatService,
    private router: Router,
    private orderService: OrderService
  ) {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.error = null;
    this.orderService.getOrders().subscribe({
      next: (apiOrders: ApiOrder[]) => {
        this.orders = apiOrders.map(o => this.mapOrderFromApi(o));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải danh sách đơn hàng.';
        this.loading = false;
      }
    });
  }

  mapOrderFromApi(apiOrder: ApiOrder): Order {
    return {
      id: apiOrder.id,
      createdAt: apiOrder.createdAt instanceof Date ? apiOrder.createdAt.toISOString() : apiOrder.createdAt,
      status: this.mapStatus(apiOrder.status),
      total: apiOrder.total,
      payment: this.mapPayment(apiOrder.paymentMethod),
      shippingInfo: {
        name: apiOrder.shippingAddress?.address || '',
        phone: '', // Nếu API có phone thì map vào đây
        address: apiOrder.shippingAddress?.address || '',
        note: apiOrder.note || ''
      },
      products: (apiOrder.items || []).map(item => ({
        id: item.productId,
        name: item.product?.name || '',
        image: item.product?.images?.[0] || '',
        price: item.price,
        quantity: item.quantity,
        color: '', // Nếu API có color thì map vào đây
        size: ''   // Nếu API có size thì map vào đây
      })),
      tracking: [], // Sẽ lấy tracking khi vào chi tiết đơn hàng
      canReview: apiOrder.status === OrderStatus.DELIVERED
    };
  }

  mapStatus(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'Đang chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Đã trả hàng';
      default: return status;
    }
  }

  mapPayment(method: string): string {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'momo': return 'Ví MoMo';
      case 'zalopay': return 'ZaloPay';
      default: return method;
    }
  }

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
    this.loading = true;
    this.orderService.getOrder(order.id).subscribe({
      next: (apiOrder: ApiOrder) => {
        const mappedOrder = this.mapOrderFromApi(apiOrder);
        // Lấy tracking
        this.orderService.getOrderTracking(order.id).subscribe({
          next: (trackings) => {
            mappedOrder.tracking = (trackings || []).map(t => ({
              status: this.mapStatus(t.status),
              location: t.location || '',
              time: t.createdAt ? new Date(t.createdAt).toLocaleString('vi-VN') : ''
            }));
            this.showDetail = mappedOrder;
            this.loading = false;
          },
          error: () => {
            this.showDetail = mappedOrder;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
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
    if (!this.reviewOrderId || !this.reviewOrderProducts.length) return;
    this.loading = true;
    const requests = this.reviewOrderProducts.map(p =>
      this.orderService.createReview(this.reviewOrderId!, {
        rating: this.reviewData[p.id]?.rating || 5,
        comment: this.reviewData[p.id]?.comment || ''
      })
    );
    Promise.all(requests.map(r => r.toPromise())).then(() => {
      this.closeReviewModal();
      this.openDetail(this.orders.find(o => o.id === this.reviewOrderId)!);
      this.loading = false;
    }).catch(() => {
      alert('Gửi đánh giá thất bại!');
      this.loading = false;
    });
  }

  getStatusLabel(status: string | undefined | null): string {
    return this.mapStatus(status || '');
  }

  getProductNames(order: Order): string {
    return order.products.map(p => p.name).join(', ');
  }

  onAttachImage(event: Event, productId: string) {
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

  sendOrderToChat(order: Order) {
    this.orderChatService.setOrder(order);
    this.router.navigate(['/chat']);
  }

  muaLai(order: Order) {
    // Giả lập thêm lại toàn bộ sản phẩm vào giỏ hàng
    alert('Đã thêm lại các sản phẩm của đơn #' + order.id + ' vào giỏ hàng!');
  }

  cancelOrder(order: Order) {
    if (!order) return;
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng #' + order.id + ' không?')) return;
    this.loading = true;
    this.orderService.cancelOrder(order.id, { reason: 'Người dùng hủy đơn' }).subscribe({
      next: () => {
        this.fetchOrders();
        if (this.showDetail && this.showDetail.id === order.id) {
          this.openDetail(order);
        }
        this.loading = false;
      },
      error: () => {
        alert('Hủy đơn hàng thất bại!');
        this.loading = false;
      }
    });
  }

  startEditShippingInfo() {
    if (!this.showDetail) return;
    this.editShippingInfo = true;
    this.shippingInfoForm = {
      name: this.showDetail.shippingInfo.name,
      phone: this.showDetail.shippingInfo.phone,
      address: this.showDetail.shippingInfo.address,
      note: this.showDetail.shippingInfo.note || ''
    };
  }

  cancelEditShippingInfo() {
    this.editShippingInfo = false;
  }

  saveShippingInfo() {
    if (!this.showDetail) return;
    this.loading = true;
    this.orderService.updateOrderInfo(this.showDetail.id, {
      shippingInfo: this.shippingInfoForm
    }).subscribe({
      next: () => {
        this.editShippingInfo = false;
        this.openDetail(this.showDetail!);
        this.loading = false;
      },
      error: () => {
        alert('Cập nhật thông tin giao hàng thất bại!');
        this.loading = false;
      }
    });
  }

  updateOrderStatus(order: Order, newStatus: string) {
    if (!order) return;
    if (!confirm('Bạn có chắc chắn muốn chuyển trạng thái đơn #' + order.id + ' sang ' + newStatus + ' không?')) return;
    this.loading = true;
    this.orderService.updateOrderStatus(order.id, { status: newStatus }).subscribe({
      next: () => {
        this.openDetail(order);
        this.loading = false;
      },
      error: () => {
        alert('Cập nhật trạng thái thất bại!');
        this.loading = false;
      }
    });
  }
}
