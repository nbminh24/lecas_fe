import { Routes } from '@angular/router';
import { SetList } from './set-list/set-list';
import { SetDetail } from './set-detail/set-detail';

export const routes: Routes = [
    { path: '', component: SetList },
    { path: ':id', component: SetDetail },
];

export function getPrerenderParams() {
    // Danh sách id set, đồng bộ với mock data trong set-list.ts và set-detail.ts
    return [
        { id: '1' },
        { id: '2' }
    ];
} 