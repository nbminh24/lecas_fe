import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PromotionPopupComponent } from '../../../shared/promotion-popup/promotion-popup.component';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.interface';

interface PromotionBanner {
    image: string;
    alt: string;
}

export interface Coupon {
    code: string;
    description: string;
    discount: string;
    expiredAt: string;
    program: string;
    isClaimed: boolean;
    remaining?: number;
}

interface HotProduct {
    image: string;
    name: string;
    desc: string;
    price: number;
    salePrice: number;
    discountPercent: number;
    remaining: number;
    total: number;
}

@Component({
    selector: 'app-promotions-page',
    standalone: true,
    imports: [CommonModule, PaginationComponent, PromotionPopupComponent],
    templateUrl: './promotions-page.html',
    styleUrl: './promotions-page.scss'
})
export class PromotionsPageComponent implements OnInit {
    banners: PromotionBanner[] = [
        { image: '/assets/promo/banner1.jpg', alt: 'Ưu đãi Hè 2024' },
        { image: '/assets/promo/banner2.jpg', alt: 'Sale Đặc Biệt' }
    ];
    coupons: Coupon[] = [
        {
            code: 'SUMMER20',
            description: 'Giảm 20% cho đơn từ 500K',
            discount: '-20%',
            expiredAt: '31/07/2024',
            program: 'Hè Sôi Động',
            isClaimed: false,
            remaining: 50
        },
        {
            code: 'FREESHIP',
            description: 'Miễn phí vận chuyển toàn quốc',
            discount: 'Freeship',
            expiredAt: '15/08/2024',
            program: 'Vận Chuyển Nhanh',
            isClaimed: false,
            remaining: 120
        },
        {
            code: 'MEN10',
            description: 'Giảm 10% cho sản phẩm Nam',
            discount: '-10%',
            expiredAt: '30/07/2024',
            program: 'Men Fashion',
            isClaimed: true,
            remaining: 0
        }
    ];
    hotProducts: Product[] = [];
    isLoadingHotProducts = true;
    errorHotProducts: string | null = null;

    // Pagination for coupons
    currentCouponPage = 1;
    pageSizeCoupon = 20;
    get pagedCoupons() {
        const start = (this.currentCouponPage - 1) * this.pageSizeCoupon;
        return this.coupons.slice(start, start + this.pageSizeCoupon);
    }
    onCouponPageChange(page: number) {
        this.currentCouponPage = page;
    }
    // Pagination for hot products
    currentHotPage = 1;
    pageSizeHot = 20;
    get pagedHotProducts() {
        const start = (this.currentHotPage - 1) * this.pageSizeHot;
        return this.hotProducts.slice(start, start + this.pageSizeHot);
    }
    onHotPageChange(page: number) {
        this.currentHotPage = page;
    }

    toastMsg = '';
    showPopup = false;

    get availableCoupons() {
        return this.coupons.filter(c => !c.isClaimed && (c.remaining ?? 1) > 0);
    }

    constructor(private productService: ProductService) { }

    ngOnInit() {
        // Hiện popup nếu còn mã chưa nhận
        if (this.coupons.some(c => !c.isClaimed && (c.remaining ?? 1) > 0)) {
            this.showPopup = true;
        }
        this.loadHotProducts();
    }

    loadHotProducts() {
        this.isLoadingHotProducts = true;
        this.errorHotProducts = null;
        this.productService.getFlashSaleProducts().subscribe({
            next: (products: Product[]) => {
                this.hotProducts = products;
                this.isLoadingHotProducts = false;
            },
            error: (err) => {
                this.errorHotProducts = 'Có lỗi khi tải sản phẩm khuyến mãi';
                this.isLoadingHotProducts = false;
            }
        });
    }

    onPopupClosed() {
        this.showPopup = false;
    }

    onCouponSaved(count: number) {
        this.toastMsg = `Bạn đã nhận thành công ${count} mã khuyến mãi!`;
        setTimeout(() => this.toastMsg = '', 3000);
    }

    claimCoupon(coupon: Coupon) {
        if (!coupon.isClaimed) {
            coupon.isClaimed = true;
            this.toastMsg = 'Đã lưu mã ' + coupon.code + ' vào ví voucher!';
            setTimeout(() => this.toastMsg = '', 2000);
        }
    }

    claimAllCoupons() {
        let count = 0;
        for (const c of this.coupons) {
            if (!c.isClaimed && (c.remaining ?? 1) > 0) {
                c.isClaimed = true;
                count++;
            }
        }
        if (count > 0) {
            this.toastMsg = 'Đã nhận ' + count + ' mã khuyến mãi!';
            setTimeout(() => this.toastMsg = '', 2000);
        } else {
            this.toastMsg = 'Bạn đã nhận hết các mã hoặc không còn lượt!';
            setTimeout(() => this.toastMsg = '', 2000);
        }
    }

    getDiscountPercent(p: Product): number {
        if (!p.originalPrice || p.originalPrice === 0) return 0;
        return Math.round((1 - p.price / p.originalPrice) * 100);
    }
} 