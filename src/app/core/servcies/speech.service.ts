import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private readonly _HttpClient = inject(HttpClient);

  textToSpeech(text: string, language: string = 'en-US'): Observable<Blob> {
    const token = localStorage.getItem('userToken');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    const body = { text, language };

    return this._HttpClient.post(`${environment.baseUrl}/api/Speech/text-to-speech`, body, { headers, responseType: 'blob' });
  }
}
