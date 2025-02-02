import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { INews } from '../../core/interfaces/inews';  // Import the interface

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly _HttpClient = inject(HttpClient);

  getAllNews(): Observable<INews[]> {
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.get<INews[]>(`${environment.baseUrl}/api/newsTwo/all`, {
      headers: headers,
      responseType: 'json'
    });
  }




  // Add to bookmarks API
  AddToFavorites(newsId: string): Observable<any> {
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    // Make sure the body structure matches what the API expects
    return this._HttpClient.post(
      `${environment.baseUrl}/api/userTwo/favorites/${newsId}`,
      { }, // Only if API expects this in the body
      { headers: headers }
    );
  }



// Remove from bookmarks API
RemoveFromBookmarks(newsId: string): Observable<any> {
  const token = localStorage.getItem('userToken');
  const headers = token
  ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
  : new HttpHeaders();
  return this._HttpClient.delete(
    `${environment.baseUrl}/api/User/favorites/${newsId}`,
    { headers: headers }
  );
}


}
