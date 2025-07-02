import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopServiceFeaturesComponent } from '../../../shared/product-features/shop-service-features.component';

interface SetIncludedProduct {
    id: number;
    name: string;
    image: string;
    color: { name: string; code: string }[];
    size: string[];
}

interface Set {
    id: number;
    name: string;
    description: string;
    image: string;
    products: SetIncludedProduct[];
    price: number;
    category?: string;
    createdAt?: string;
    rating?: number;
}

@Component({
    selector: 'app-set-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, ShopServiceFeaturesComponent],
    templateUrl: './set-detail.html',
    styleUrls: ['./set-detail.scss']
})
export class SetDetail implements OnInit {
    set: Set | undefined;
    selectedOptions: { [productId: number]: { color: string; size: string } } = {};
    Math = Math;

    // Mock data - In a real app, this would come from a service
    private mockSets: Set[] = [
        {
            id: 1,
            name: 'Set Đồ Basic Monochrome',
            description: 'Áo thun + Quần jeans + Giày sneakers - Một sự kết hợp hoàn hảo cho phong cách tối giản và hiện đại. Mang đến vẻ ngoài tinh tế và dễ phối đồ, phù hợp cho mọi dịp.',
            image: '/assets/sets/set1.jpg',
            products: [
                {
                    id: 101, name: 'Áo thun trắng cơ bản', image: '/assets/products/tee-white.jpg', color: [
                        { name: 'Trắng', code: '#fff' },
                        { name: 'Đen', code: '#222' },
                        { name: 'Xám', code: '#888' }
                    ], size: ['S', 'M', 'L', 'XL']
                },
                {
                    id: 102, name: 'Quần jeans slim fit xanh', image: '/assets/products/jeans-blue.jpg', color: [
                        { name: 'Xanh', code: '#2a4d7a' },
                        { name: 'Đen', code: '#222' }
                    ], size: ['29', '30', '31', '32', '33', '34']
                },
                {
                    id: 103, name: 'Giày sneakers cổ thấp đen', image: '/assets/products/sneaker-black.jpg', color: [
                        { name: 'Đen', code: '#222' },
                        { name: 'Trắng', code: '#fff' }
                    ], size: ['39', '40', '41', '42', '43']
                }
            ],
            price: 1199000,
            category: 'basic',
            createdAt: '2023-01-15T10:00:00Z',
            rating: 4.5
        },
        {
            id: 2,
            name: 'Set Đồ Năng Động',
            description: 'Áo polo + Quần short + Giày thể thao - Lý tưởng cho những ai yêu thích sự thoải mái và phong cách khi vận động hoặc dạo phố. Thiết kế năng động, dễ chịu.',
            image: '/assets/sets/set2.jpg',
            products: [
                {
                    id: 104, name: 'Áo polo thể thao đen', image: '/assets/products/polo-black.jpg', color: [
                        { name: 'Đen', code: '#222' },
                        { name: 'Xám', code: '#888' }
                    ], size: ['M', 'L', 'XL']
                },
                {
                    id: 105, name: 'Quần short cotton xám', image: '/assets/products/short-grey.jpg', color: [
                        { name: 'Xám', code: '#888' },
                        { name: 'Kem', code: '#f5e9da' }
                    ], size: ['28', '30', '32', '34']
                },
                {
                    id: 106, name: 'Giày thể thao trắng cổ điển', image: '/assets/products/sport-white.jpg', color: [
                        { name: 'Trắng', code: '#fff' },
                        { name: 'Xám', code: '#888' }
                    ], size: ['40', '41', '42', '43']
                }
            ],
            price: 990000,
            category: 'sporty',
            createdAt: '2023-02-20T12:30:00Z',
            rating: 4.2
        }
    ];

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const setId = Number(params.get('id'));
            this.set = this.mockSets.find(s => s.id === setId);

            if (this.set) {
                // Initialize selected options for products in the set
                this.set.products.forEach((p: SetIncludedProduct) => {
                    this.selectedOptions[p.id] = {
                        color: p.color[0]?.name,
                        size: p.size[0]
                    };
                });
            }
        });
    }

    addToCart() {
        if (this.set) {
            console.log('Adding set to cart:', this.set.name, 'with options:', this.selectedOptions);
            alert(`Đã thêm set \'${this.set.name}\' vào giỏ hàng!`);
            // Implement actual add to cart logic here
        }
    }

    buyNow() {
        if (this.set) {
            console.log('Buying set now:', this.set.name, 'with options:', this.selectedOptions);
            alert(`Chức năng mua ngay set \'${this.set.name}\'!`);
            // Implement actual buy now logic here (e.g., navigate to checkout)
        }
    }

    // Helper to check if a product has multiple colors
    hasMultipleColors(product: SetIncludedProduct): boolean {
        return product.color.length > 1;
    }

    // Helper to check if a product has multiple sizes
    hasMultipleSizes(product: SetIncludedProduct): boolean {
        return product.size.length > 1;
    }

    // Helper to navigate back (optional)
    goBack(): void {
        this.router.navigate(['/sets']);
    }
} 