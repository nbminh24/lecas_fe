import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next) => {
    let token = '';
    if (isBrowser()) {
        token = localStorage.getItem('accessToken') || '';
    }

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
}; 