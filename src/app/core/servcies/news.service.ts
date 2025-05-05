import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { INews } from '../../core/interfaces/inews';  // Import the interface

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly _HttpClient = inject(HttpClient);

  getAllNews(pageNumber: number, pageSize: number): Observable<INews[]> { 
    const token = localStorage.getItem('userToken');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pagesize', pageSize.toString()); 

    return this._HttpClient.get<INews[]>(`${environment.baseUrl}/api/newsTwo/all`, { headers, params });
}  

  getUserId(): Observable<any> {
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization',` Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.get<INews[]>(`${environment.baseUrl}/api/userTwo/me`, {
      headers: headers,
      responseType: 'json'
    });
  }


  // Add to bookmarks API
  AddToFavorites(newsId: string): Observable<any> {
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization',` Bearer ${token}`)
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
  ? new HttpHeaders().set('Authorization',` Bearer ${token}`)
  : new HttpHeaders();
  return this._HttpClient.delete(
    `${environment.baseUrl}/api/userTwo/favorites/${newsId}`,
    { headers: headers }
  );
}

  private bookmarkChangeSubject = new BehaviorSubject<string | null>(null);
  bookmarkChange$ = this.bookmarkChangeSubject.asObservable();

// Notify components when a bookmark is added or removed
  notifyBookmarkChange(newsId: string) {
    this.bookmarkChangeSubject.next(newsId);
  }


  getArticleByCategory(category:string):Observable<INews[]>{
    const token = localStorage.getItem('userToken');
    const headers = token
      ? new HttpHeaders().set('Authorization',` Bearer ${token}`)
      : new HttpHeaders();

    return this._HttpClient.get<INews[]>(`${environment.baseUrl}/api/newsTwo/category/${category}`, {
      headers: headers,
      responseType: 'json'
    });
  }

  searchNews(query: string, newsList: INews[]): INews[] {
    if (!query) return newsList;
  
    query = query.toLowerCase();
  
    return newsList.filter(news =>
      news.title.toLowerCase().includes(query) ||
      news.topic.toLowerCase().includes(query)
    );
  }
  
}
