import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-set-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './set-card.html',
    styleUrls: ['./set-card.scss']
})
export class SetCard {
    @Input() set: any;
    Math = Math;
} 