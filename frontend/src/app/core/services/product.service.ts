import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;
    private productsCache: Product[] | null = null;

    constructor(private http: HttpClient) { }

    // Get cached products immediately
    getCachedProducts(): Product[] | null {
        return this.productsCache;
    }

    // Raw response for internal/admin use
    getProducts(keyword?: string, ids?: string[]): Observable<{ status: string, results: number, data: Product[] }> {
        const params: any = {};
        if (keyword) {
            params.keyword = keyword;
        }
        if (ids && ids.length > 0) {
            params.ids = ids.join(',');
        }
        return this.http.get<{ status: string, results: number, data: Product[] }>(this.apiUrl, { params });
    }

    // Convenience method for components with optional caching
    getAllProducts(keyword?: string, ids?: string[], category?: string, limit?: number): Observable<Product[]> {
        const params: any = {};
        if (keyword) params.keyword = keyword;
        if (ids && ids.length) params.ids = ids.join(',');
        if (category) params.category = category;
        if (limit) params.limit = limit.toString();

        return this.http.get<{ status: string, results: number, data: Product[] }>(this.apiUrl, { params }).pipe(
            map(response => {
                if (!keyword && !ids && !category && !limit) {
                    this.productsCache = response.data;
                }
                return response.data;
            })
        );
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<{ status: string, data: Product }>(`${this.apiUrl}/${id}`)
            .pipe(map(response => response.data));
    }

    createProduct(product: any): Observable<Product> {
        return this.http.post<{ status: string, data: Product }>(this.apiUrl, product)
            .pipe(map(res => res.data));
    }

    updateProduct(id: string, product: any): Observable<Product> {
        return this.http.put<{ status: string, data: Product }>(`${this.apiUrl}/${id}`, product)
            .pipe(map(res => res.data));
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
