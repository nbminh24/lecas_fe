import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpService, ApiResponse } from './http.service';
import {
  User,
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AddAddressRequest
} from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpService: HttpService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpService.post<LoginResponse>('/auth/login', credentials).pipe(
      map(response => response.data!),
      tap(data => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.currentUserSubject.next(data.user as User);
      })
    );
  }

  googleLogin(request: GoogleLoginRequest): Observable<LoginResponse> {
    return this.httpService.post<LoginResponse>('/auth/google-login', request).pipe(
      map(response => response.data!),
      tap(data => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.currentUserSubject.next(data.user as User);
      })
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<LoginResponse> {
    return this.httpService.post<LoginResponse>('/auth/refresh-token', request).pipe(
      map(response => response.data!),
      tap(data => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      })
    );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      return this.httpService.post('/auth/logout', { refreshToken }).pipe(
        tap(() => {
          this.clearAuthData();
        })
      );
    } else {
      this.clearAuthData();
      return new Observable(observer => observer.next({ success: true }));
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.httpService.get<User>('/auth/me').pipe(
      map(response => response.data!)
    );
  }

  getProfile(): Observable<User> {
    return this.httpService.get<User>('/users/profile').pipe(
      map(response => response.data!)
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<User> {
    return this.httpService.put<User>('/users/profile', request).pipe(
      map(response => response.data!),
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser };
          localStorage.setItem('user', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
        }
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.httpService.post('/users/change-password', request);
  }

  addAddress(request: AddAddressRequest): Observable<User> {
    return this.httpService.post<User>('/users/addresses', request).pipe(
      map(response => response.data!),
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const newUser = { ...currentUser, addresses: updatedUser.addresses };
          localStorage.setItem('user', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
        }
      })
    );
  }

  deleteAddress(addressId: string): Observable<User> {
    return this.httpService.delete<User>(`/users/addresses/${addressId}`).pipe(
      map(response => response.data!),
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const newUser = { ...currentUser, addresses: updatedUser.addresses };
          localStorage.setItem('user', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
        }
      })
    );
  }

  verifyEmail(token: string): Observable<any> {
    return this.httpService.post('/auth/verify-email', { token });
  }

  resendVerification(email: string): Observable<any> {
    return this.httpService.post('/auth/resend-verification', { email });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
