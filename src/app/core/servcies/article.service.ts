import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private readonly _HttpClient=inject(HttpClient)

  getArticlebyId(articleId:string):Observable<any>{
      const token = localStorage.getItem('userToken');
        const headers = token
          ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
          : new HttpHeaders();
    return this._HttpClient.get(`${environment.baseUrl}/api/newsTwo/${articleId}`,{ headers: headers })
  }
}
