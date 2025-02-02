import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories } from '../interfaces/icategories';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly _HttpClient = inject(HttpClient);

  getAllCategories(): Observable<ICategories> {
    const token = localStorage.getItem('userToken'); // Retrieve the token from localStorage

    // Create the headers object if a token exists
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders(); // No token, empty headers

    // Fetch categories from the API
    return this._HttpClient.get<ICategories>(`http://localhost:5069/api/news/all-categories`, {
      headers: headers,
      responseType: 'json'
    });
  }

  addCategory(cat_name: string): Observable<any> {
    const token = localStorage.getItem('userToken');

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.post(` ${environment.baseUrl}/api/user/set-preferred-categories`,
      {
        categoryNames: [cat_name],
      },
      {
        headers,
        responseType: 'text',
      }
  );
}


}
