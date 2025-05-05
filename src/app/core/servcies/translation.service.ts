import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private readonly _HttpClient = inject(HttpClient);
  private apiUrl = `https://localhost:7291/api/Translation/translate`

  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string, sourceLang: string = 'en'): Observable<any> {
    const token = localStorage.getItem('userToken');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    const body = {
      text: text,
      sourceLang: sourceLang,
      targetLang: targetLang
    };
  // translate(text: string, language: string): Observable<any> {
  //   const token = localStorage.getItem('userToken');
  //   const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

  //   const body = { text, language };

    return this._HttpClient.post(`${environment.baseUrl}/api/Translation/translate`, body, { headers });
  }
}
