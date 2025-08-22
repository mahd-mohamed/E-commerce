import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { environment } from '../../../../environments/environment.development';

export interface ApiResponse {
  metadata: any;
  status: string;
  results: number;
  data: Product[];
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  // private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1';
  
  getProducts(page: number = 1, limit: number = 10): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${environment.apiUrl}/products?page=${page}&limit=${limit}`);
  }

}
