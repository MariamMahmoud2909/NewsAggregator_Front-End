import { INews } from './../interfaces/inews';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedNewsService {

  private readonly _HttpClient= inject(HttpClient);

  getSavedNews():Observable<INews[]>
  {
    const token = localStorage.getItem('userToken');

        const headers = token
          ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
          : new HttpHeaders();

    return this._HttpClient.get<INews[]>(`${environment.baseUrl}/api/UserTwo/favorites`,{
      headers: headers,
      responseType: 'json'
    })
  }
}
