import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderChatService {
    private orderToChatSubject = new BehaviorSubject<any | null>(null);
    orderToChat$ = this.orderToChatSubject.asObservable();

    setOrder(order: any) {
        this.orderToChatSubject.next(order);
    }

    clearOrder() {
        this.orderToChatSubject.next(null);
    }

    getOrder() {
        return this.orderToChatSubject.getValue();
    }
} 