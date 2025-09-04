import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BrandsApiResponse } from '../models/brand.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);
  
  getAllBrands(limit: number = 10, keyword?: string, page: number = 1): Observable<BrandsApiResponse> {
    let url = `${environment.apiUrl}/brands?limit=${limit}&page=${page}`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    return this.httpClient.get<BrandsApiResponse>(url);
  }
}
