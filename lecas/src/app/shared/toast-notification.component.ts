import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toast-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-notification" [class.show]="show" [ngClass]="type">
      <span class="toast-message">{{ message }}</span>
    </div>
  `,
    styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent {
    @Input() message = '';
    @Input() type: 'success' | 'error' | 'info' = 'info';
    show = false;

    ngOnInit() {
        this.show = true;
        setTimeout(() => this.show = false, 3000);
    }
} 