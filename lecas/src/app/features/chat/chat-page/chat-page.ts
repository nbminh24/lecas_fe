import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderChatService } from '../../../core/services/order-chat.service';

interface Message {
    from: string;
    content?: string;
    time: string;
    isMe: boolean;
    type?: 'text' | 'order';
    order?: any;
}

@Component({
    selector: 'app-chat-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat-page.html',
    styleUrl: './chat-page.scss'
})
export class ChatPageComponent implements OnInit {
    messages: Message[] = [
        { from: 'Admin', content: 'Chào bạn! LeCas có thể giúp gì cho bạn?', time: '09:00', isMe: false, type: 'text' },
        { from: 'Nguyễn Văn A', content: 'Shop còn áo polo đen size L không?', time: '09:01', isMe: true, type: 'text' },
        { from: 'Admin', content: 'Dạ còn bạn nhé!', time: '09:02', isMe: false, type: 'text' }
    ];
    newMessage = '';

    constructor(private orderChatService: OrderChatService) { }

    ngOnInit() {
        const order = this.orderChatService.getOrder();
        if (order) {
            this.messages.push({
                from: 'Nguyễn Văn A',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
                type: 'order',
                order
            });
            this.orderChatService.clearOrder();
        }
    }

    sendMessage() {
        if (this.newMessage.trim()) {
            this.messages.push({
                from: 'Nguyễn Văn A',
                content: this.newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
                type: 'text'
            });
            this.newMessage = '';
        }
    }
} 