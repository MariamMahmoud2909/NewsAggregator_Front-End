import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

    private readonly _HttpClient = inject(HttpClient);

  constructor() { }

  setContactForm(data:object):Observable<any>
    {
      return this._HttpClient.post(`${environment.baseUrl}/api/user/send-feedback` ,data)
    }

}
