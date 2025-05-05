import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private readonly _HttpClient=inject(HttpClient)

  getArticlebyId(articleId:string | null):Observable<any>{
      const token = localStorage.getItem('userToken');
        const headers = token
          ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
          : new HttpHeaders();
    return this._HttpClient.get(`${environment.baseUrl}/api/newsTwo/${articleId}`,{ headers: headers })
  }

  getCommentsForSpecificArticle(articleId:string | null):Observable<any>{
      const token = localStorage.getItem('userToken');
        const headers = token
          ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
          : new HttpHeaders();
    return this._HttpClient.get(`${environment.baseUrl}/api/comment/article/${articleId}`,{ headers: headers })
  }

  downloadArticle(articleId: string | null): Observable<Blob> {
    const token = localStorage.getItem('userToken');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this._HttpClient.get(`${environment.baseUrl}/api/newsTwo/generate-pdf/${articleId}`, {
      headers: headers,
      responseType: 'blob'
    });
  }


  shareArticle(data:object, articleId:string | null):Observable<any>{
    const token = localStorage.getItem('userToken');
    const headers = token
    ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
    : new HttpHeaders();
    return this._HttpClient.post(`${environment.baseUrl}/api/userTwo/share-article/${articleId}`, data, { headers: headers })
  }


  setComment(data:object, articleId:string | null):Observable<any>{
    const token = localStorage.getItem('userToken');
    const headers = token
    ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
    : new HttpHeaders();
    return this._HttpClient.post(`${environment.baseUrl}/api/Comment/${articleId}/comments`, data, { headers: headers })
  }


  setSurvey(data:object):Observable<any>
  {
    const token = localStorage.getItem('userToken');
    const headers = token
    ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
    : new HttpHeaders();
    return this._HttpClient.post(`${environment.baseUrl}/api/UserTwo/send-survey` ,data, { headers: headers })
  }


}
