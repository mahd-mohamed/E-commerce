import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  




  getAllCategories() {

    return this.httpClient.get(`${environment.apiUrl}/categories`);
  }
  
}
