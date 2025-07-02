import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

interface PromotionBanner {
    image: string;
    alt: string;
}

interface Coupon {
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
    imports: [CommonModule, PaginationComponent],
    templateUrl: './promotions-page.html',
    styleUrl: './promotions-page.scss'
})
export class PromotionsPageComponent {
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
    hotProducts: HotProduct[] = [
        {
            image: '/assets/products/polo-black.jpg',
            name: 'Áo Polo Nam Casual',
            desc: 'Chất liệu cotton thoáng mát, giảm sốc mùa hè!',
            price: 299000,
            salePrice: 219000,
            discountPercent: 27,
            remaining: 12,
            total: 50
        },
        {
            image: '/assets/products/tee-white.jpg',
            name: 'Áo Thun Basic',
            desc: 'Best seller, giá cực tốt chỉ hôm nay!',
            price: 249000,
            salePrice: 179000,
            discountPercent: 28,
            remaining: 5,
            total: 30
        },
        {
            image: '/assets/products/jeans-blue.jpg',
            name: 'Quần Jeans Slimfit',
            desc: 'Form ôm, tôn dáng, giảm sâu cuối tuần!',
            price: 399000,
            salePrice: 299000,
            discountPercent: 25,
            remaining: 8,
            total: 40
        }
    ];

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

    claimCoupon(coupon: Coupon) {
        if (!coupon.isClaimed) {
            coupon.isClaimed = true;
            alert('Đã lưu mã ' + coupon.code + ' vào ví voucher!');
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
            alert('Đã nhận ' + count + ' mã khuyến mãi!');
        } else {
            alert('Bạn đã nhận hết các mã hoặc không còn lượt!');
        }
    }
} 