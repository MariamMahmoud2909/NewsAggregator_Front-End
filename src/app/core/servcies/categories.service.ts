import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICategories } from '../interfaces/icategories';
import { environment } from '../environments/environment';
import { INews } from '../interfaces/inews';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly _HttpClient = inject(HttpClient);

  getAllCategories(): Observable<ICategories> {
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.get<ICategories>(`${environment.baseUrl}/api/newsTwo/categories`, {
      headers: headers,
      responseType: 'json'
    });
  }

  addCategory(cat_name: string): Observable<any> {
    const token = localStorage.getItem('userToken');

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.post(` ${environment.baseUrl}/api/userTwo/set-preferred-categories`,
      {
        categoryNames: [cat_name],
      },
      {
        headers,
        responseType: 'text',
      }
  );
}


private selectedCategoriesCount = new BehaviorSubject<number>(0);
  selectedCategoriesCount$ = this.selectedCategoriesCount.asObservable();

  updateSelectedCategoriesCount(count: number): void {
    this.selectedCategoriesCount.next(count);
  
    // ✅ Save to localStorage for the current user
    const userId = localStorage.getItem('userId');
    if (userId) {
      localStorage.setItem(`selectedCategories_${userId}`, JSON.stringify(count));
    }
  }
  
  // ✅ Reset category count when user logs in
  resetSelectedCategoriesForUser(userId: string): void {
    const savedCount = localStorage.getItem(`selectedCategories_${userId}`);
    const count = savedCount ? JSON.parse(savedCount) : 0;
  
    console.log(`Resetting selected categories count for user ${userId}:`, count);
    this.selectedCategoriesCount.next(count);
  }
  

  getArticlesByCategory(categoryName:string):Observable<INews[]>
  {
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.get<INews[]>(`${environment.baseUrl}/api/newsTwo/category/${categoryName}`, {
      headers: headers,
      responseType: 'json'
    });
  }


}
