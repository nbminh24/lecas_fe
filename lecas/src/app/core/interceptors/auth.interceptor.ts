import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
}; 