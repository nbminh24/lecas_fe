import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home/home').then(m => m.Home)
    },
    {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetail)
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart/cart').then(m => m.Cart)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/account/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/account/register/register').then(m => m.Register)
    },
    {
        path: 'orders',
        loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderList)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
