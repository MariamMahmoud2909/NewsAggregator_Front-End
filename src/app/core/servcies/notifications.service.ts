import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

    private readonly _HttpClient = inject(HttpClient);


    getNotifications(): Observable<any> {
      const token = localStorage.getItem('userToken');
      return this._HttpClient.get(`${environment.baseUrl}/api/UserTwo/get-notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
}
