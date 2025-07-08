import { Component, EventEmitter, Output, ChangeDetectorRef, Input } from '@angular/core';
import { Coupon } from '../../features/promotions/promotions-page/promotions-page';

@Component({
    selector: 'app-promotion-popup',
    templateUrl: './promotion-popup.component.html',
    styleUrls: ['./promotion-popup.component.scss']
})
export class PromotionPopupComponent {
    @Input() coupons: Coupon[] = [];
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<number>();

    constructor(private cdr: ChangeDetectorRef) { }

    saveCoupon(code: string) {
        const coupon = this.coupons.find(c => c.code === code);
        if (coupon && !coupon.isClaimed) {
            coupon.isClaimed = true;
            this.saved.emit(1);
            this.cdr.detectChanges();
            if (this.coupons.filter(c => !c.isClaimed && (c.remaining ?? 1) > 0).length === 0) this.closed.emit();
        }
    }

    saveAll() {
        let count = 0;
        for (const c of this.coupons) {
            if (!c.isClaimed && (c.remaining ?? 1) > 0) {
                c.isClaimed = true;
                count++;
            }
        }
        this.saved.emit(count);
        this.cdr.detectChanges();
        this.closed.emit();
    }

    close() {
        this.closed.emit();
    }
} 