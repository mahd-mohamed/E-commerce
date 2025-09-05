import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../../core/services/products/products.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryDetailsService {
    private readonly httpClient = inject(HttpClient)
   
    getCategoryDetails(id: string): Observable<any> {
    
        return this.httpClient.get<ApiResponse>(`${environment.apiUrl}/categories/${id}`);
      }


  
}
