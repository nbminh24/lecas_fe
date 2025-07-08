import { Component, AfterViewInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements AfterViewInit {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: Auth, private router: Router) { }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  onLogin(event: Event) {
    event.preventDefault();
    this.error = '';
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        this.error = 'Sai email hoặc mật khẩu. Vui lòng đăng nhập bằng Google!';
      }
    });
  }

  onGoogleLogin() {
    this.error = '';
    this.loading = true;
    const tryGoogleSignIn = () => {
      if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.accounts) {
        setTimeout(tryGoogleSignIn, 100);
        return;
      }
      (window as any).google.accounts.id.initialize({
        client_id: '936284110264-c9efs1v2r4m9sbi0bb2u9fm0as244nmn.apps.googleusercontent.com',
        callback: (response: any) => {
          console.log('Google credential response:', response);
          if (response.credential) {
            this.auth.googleLogin({ idToken: response.credential }).subscribe({
              next: () => {
                this.loading = false;
                this.router.navigate(['/']);
              },
              error: (err) => {
                this.loading = false;
                this.error = 'Đăng nhập Google thất bại!';
                console.error('Google login error:', err.error?.errors || err);
              }
            });
          } else {
            this.loading = false;
            this.error = 'Không lấy được thông tin Google.';
          }
        },
        ux_mode: 'popup',
      });
      (window as any).google.accounts.id.prompt();
    };
    tryGoogleSignIn();
  }
}
