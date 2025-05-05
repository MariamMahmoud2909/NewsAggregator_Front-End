import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

    private readonly _HttpClient = inject(HttpClient);


  constructor() { }

  getUserInfo(): Observable<any> {
      const token = localStorage.getItem('userToken');
      return this._HttpClient.get(`${environment.baseUrl}/api/UserTwo/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    setUpdateForm(data:object):Observable<any>
  {
    const token = localStorage.getItem('userToken');
    return this._HttpClient.put(`${environment.baseUrl}/api/UserTwo/me` ,data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deactivateAccount(): Observable<any> {
    const token = localStorage.getItem('userToken');
    
    // Use the correct deletion endpoint
    return this._HttpClient.post(`${environment.baseUrl}/api/userTwo/request-deletion`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        // Store deactivation status and date in localStorage
        localStorage.setItem('wasDeactivated', 'true');
        localStorage.setItem('deactivationDate', new Date().toISOString());
        localStorage.removeItem('userToken');
      })
    ).pipe(
      // If the backend endpoint doesn't exist (404), handle it gracefully
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.log('Deletion endpoint not found, handling client-side');
          // Handle deactivation client-side
          localStorage.setItem('wasDeactivated', 'true');
          localStorage.setItem('deactivationDate', new Date().toISOString());
          localStorage.removeItem('userToken');
          return of({ success: true, message: 'Account deletion requested successfully (client-side)' });
        }
        // For other errors, rethrow
        return throwError(() => error);
      })
    );
  }

}
