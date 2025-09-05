import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SubCategoryResponse } from '../../models/subcategory.interface';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private readonly httpClient = inject(HttpClient);

  getAllSubCategories(page: number = 1, limit: number = 12): Observable<SubCategoryResponse> {
    return this.httpClient.get<SubCategoryResponse>(`${environment.apiUrl}/subcategories?page=${page}&limit=${limit}`);
  }

  getSubCategoriesByCategory(categoryId: string): Observable<SubCategoryResponse> {
    return this.httpClient.get<SubCategoryResponse>(`${environment.apiUrl}/categories/${categoryId}/subcategories`);
  }
}
