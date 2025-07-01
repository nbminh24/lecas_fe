import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductCategory, ProductFilter } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Áo Polo Nam Casual',
      description: 'Áo polo nam chất liệu cotton thoáng mát, thiết kế đơn giản phù hợp mọi dịp',
      price: 299000,
      originalPrice: 399000,
      images: [
        'https://via.placeholder.com/400x500/4A90E2/FFFFFF?text=Polo+1',
        'https://via.placeholder.com/400x500/4A90E2/FFFFFF?text=Polo+2'
      ],
      category: ProductCategory.TOPS,
      subCategory: 'polo',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Trắng', code: '#FFFFFF', available: true },
        { name: 'Đen', code: '#000000', available: true },
        { name: 'Xanh Navy', code: '#000080', available: true }
      ],
      inStock: true,
      rating: 4.5,
      reviewCount: 128,
      tags: ['polo', 'casual', 'cotton'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Quần Jeans Nam Slim Fit',
      description: 'Quần jeans nam slim fit thời trang, chất liệu denim cao cấp',
      price: 599000,
      originalPrice: 799000,
      images: [
        'https://via.placeholder.com/400x500/50C878/FFFFFF?text=Jeans+1',
        'https://via.placeholder.com/400x500/50C878/FFFFFF?text=Jeans+2'
      ],
      category: ProductCategory.BOTTOMS,
      subCategory: 'jeans',
      sizes: ['28', '30', '32', '34', '36'],
      colors: [
        { name: 'Xanh Đậm', code: '#191970', available: true },
        { name: 'Xanh Nhạt', code: '#87CEEB', available: true }
      ],
      inStock: true,
      rating: 4.3,
      reviewCount: 95,
      tags: ['jeans', 'slim-fit', 'denim'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'Áo Khoác Bomber Nam',
      description: 'Áo khoác bomber nam phong cách streetwear, chất liệu polyester bền bỉ',
      price: 899000,
      originalPrice: 1199000,
      images: [
        'https://via.placeholder.com/400x500/8B4513/FFFFFF?text=Bomber+1',
        'https://via.placeholder.com/400x500/8B4513/FFFFFF?text=Bomber+2'
      ],
      category: ProductCategory.OUTERWEAR,
      subCategory: 'bomber',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Đen', code: '#000000', available: true },
        { name: 'Xanh Army', code: '#4B5320', available: true }
      ],
      inStock: true,
      rating: 4.7,
      reviewCount: 67,
      tags: ['bomber', 'streetwear', 'outerwear'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '4',
      name: 'Thắt Lưng Da Nam',
      description: 'Thắt lưng da nam cao cấp, thiết kế tối giản phù hợp mọi trang phục',
      price: 199000,
      originalPrice: 299000,
      images: [
        'https://via.placeholder.com/400x500/FF6B6B/FFFFFF?text=Belt+1',
        'https://via.placeholder.com/400x500/FF6B6B/FFFFFF?text=Belt+2'
      ],
      category: ProductCategory.ACCESSORIES,
      subCategory: 'belts',
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Nâu', code: '#8B4513', available: true },
        { name: 'Đen', code: '#000000', available: true }
      ],
      inStock: true,
      rating: 4.6,
      reviewCount: 42,
      tags: ['belt', 'leather', 'accessories'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '5',
      name: 'Khăn Choàng Cổ Nam',
      description: 'Khăn choàng cổ nam len mềm mại, thiết kế unisex thời trang',
      price: 159000,
      originalPrice: 199000,
      images: [
        'https://via.placeholder.com/400x500/9370DB/FFFFFF?text=Scarf+1',
        'https://via.placeholder.com/400x500/9370DB/FFFFFF?text=Scarf+2'
      ],
      category: ProductCategory.ACCESSORIES,
      subCategory: 'scarves',
      sizes: ['One Size'],
      colors: [
        { name: 'Xám', code: '#808080', available: true },
        { name: 'Đen', code: '#000000', available: true },
        { name: 'Nâu', code: '#8B4513', available: true }
      ],
      inStock: true,
      rating: 4.4,
      reviewCount: 38,
      tags: ['scarf', 'winter', 'accessories'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: '6',
      name: 'Áo Sơ Mi Nam Cổ Bẻ',
      description: 'Áo sơ mi nam cổ bẻ thanh lịch, chất liệu cotton cao cấp',
      price: 399000,
      originalPrice: 499000,
      images: [
        'https://via.placeholder.com/400x500/20B2AA/FFFFFF?text=Shirt+1',
        'https://via.placeholder.com/400x500/20B2AA/FFFFFF?text=Shirt+2'
      ],
      category: ProductCategory.TOPS,
      subCategory: 'shirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Trắng', code: '#FFFFFF', available: true },
        { name: 'Xanh Nhạt', code: '#87CEEB', available: true },
        { name: 'Hồng Nhạt', code: '#FFB6C1', available: true }
      ],
      inStock: true,
      rating: 4.8,
      reviewCount: 156,
      tags: ['shirt', 'formal', 'cotton'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '7',
      name: 'Quần Khaki Nam',
      description: 'Quần khaki nam thoải mái, phù hợp mọi dịp từ casual đến semi-formal',
      price: 349000,
      originalPrice: 449000,
      images: [
        'https://via.placeholder.com/400x500/DAA520/FFFFFF?text=Khaki+1',
        'https://via.placeholder.com/400x500/DAA520/FFFFFF?text=Khaki+2'
      ],
      category: ProductCategory.BOTTOMS,
      subCategory: 'khaki',
      sizes: ['28', '30', '32', '34', '36'],
      colors: [
        { name: 'Khaki', code: '#F4A460', available: true },
        { name: 'Nâu', code: '#8B4513', available: true },
        { name: 'Xanh Army', code: '#4B5320', available: true }
      ],
      inStock: true,
      rating: 4.2,
      reviewCount: 89,
      tags: ['khaki', 'casual', 'comfortable'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '8',
      name: 'Túi Xách Nam',
      description: 'Túi xách nam đeo chéo thời trang, chất liệu canvas bền bỉ',
      price: 299000,
      originalPrice: 399000,
      images: [
        'https://via.placeholder.com/400x500/32CD32/FFFFFF?text=Bag+1',
        'https://via.placeholder.com/400x500/32CD32/FFFFFF?text=Bag+2'
      ],
      category: ProductCategory.ACCESSORIES,
      subCategory: 'bags',
      sizes: ['One Size'],
      colors: [
        { name: 'Đen', code: '#000000', available: true },
        { name: 'Nâu', code: '#8B4513', available: true },
        { name: 'Xanh Navy', code: '#000080', available: true }
      ],
      inStock: true,
      rating: 4.5,
      reviewCount: 73,
      tags: ['bag', 'crossbody', 'canvas'],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14')
    }
  ];

  constructor() { }

  getProducts(filter?: ProductFilter): Observable<Product[]> {
    let filteredProducts = [...this.mockProducts];

    if (filter) {
      if (filter.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filter.category);
      }
      if (filter.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filter.minPrice!);
      }
      if (filter.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filter.maxPrice!);
      }
      if (filter.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.inStock === filter.inStock);
      }
    }

    return of(filteredProducts);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    const products = this.mockProducts.filter(p => p.category === category);
    return of(products);
  }

  searchProducts(query: string): Observable<Product[]> {
    const products = this.mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(products);
  }
}
