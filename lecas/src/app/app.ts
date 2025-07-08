import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastNotificationComponent } from './shared/toast-notification.component';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast$ = new BehaviorSubject<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toast$.next({ message, type });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, ToastNotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'lecas';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;
  constructor(public router: Router, public toastService: ToastService) {
    this.toastService.toast$.subscribe(t => {
      this.toast = t;
    });
  }

  get hideLayout() {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }
}
