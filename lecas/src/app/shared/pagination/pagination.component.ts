import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
    @Input() totalItems = 0;
    @Input() pageSize = 20;
    @Input() currentPage = 1;
    @Output() pageChange = new EventEmitter<number>();

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize) || 1;
    }

    get pages(): number[] {
        const total = this.totalPages;
        const cur = this.currentPage;
        const delta = 2;
        const range = [];
        for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
            range.push(i);
        }
        if (range[0] > 1) range.unshift(1);
        if (range[range.length - 1] < total) range.push(total);
        return range;
    }

    goTo(page: number) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;
        this.pageChange.emit(page);
    }
} 