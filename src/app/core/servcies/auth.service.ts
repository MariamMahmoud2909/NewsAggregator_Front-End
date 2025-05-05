import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient);

  userData:any = null;
  name:string = "";

  constructor() {
    this.loadUserData();  // Load user data on service initialization
  }


  setRegisterForm(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/Account/register`, data).pipe(
      tap(() => {
        localStorage.setItem('isNewUser', 'true'); // Mark user as new after signup
      })
    );
  }
  
  setLoginForm(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/account/login`, data).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        
        // Check if the user is deactivated from the backend response
        if (response.isDeactivated) {
          localStorage.removeItem('userToken');
          localStorage.setItem('wasDeactivated', 'true');
          throw new Error('Your account has been deactivated. Please contact support for assistance.');
        }
        
        // Check if the account was previously marked for deletion
        const wasDeactivated = localStorage.getItem('wasDeactivated');
        const deactivationDate = localStorage.getItem('deactivationDate');
        
        if (wasDeactivated === 'true' && deactivationDate) {
          // Calculate if deletion request was within the last 14 days
          const deactivationTime = new Date(deactivationDate).getTime();
          const currentTime = new Date().getTime();
          const daysSinceDeactivation = (currentTime - deactivationTime) / (1000 * 60 * 60 * 24);
          
          if (daysSinceDeactivation <= 14) {
            console.log('Account deletion request was within the last 14 days, showing cancellation message');
            // Set a flag to indicate this is a deletion cancellation within 14 days
            localStorage.setItem('reactivationWithin14Days', 'true');
          }
          
          localStorage.removeItem('wasDeactivated'); // Clear the flag
          localStorage.removeItem('deactivationDate'); // Clear the date
        }
        
        // Store the message from the backend if it exists
        if (response.message) {
          console.log('Backend message:', response.message);
        }
        
        localStorage.removeItem('isNewUser'); // Remove new user flag after login
      })
    );
  }


  saveUserData(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.userData = jwtDecode(token);
    }
  }

  private loadUserData(): void {
    this.saveUserData();  // Ensure data is restored when the service is created
  }


    setforgetpasswordForm(data:object):Observable<any>
    {
      return this._HttpClient.post(`${environment.baseUrl}/api/Account/forgot-password` ,data)
    }

    verificationCodeForm(data:object):Observable<any>
    {
      return this._HttpClient.post(`${environment.baseUrl}/api/Account/validate-verification-code` ,data)
    }

    resetpaswordForm(data:object):Observable<any>
    {
      return this._HttpClient.post(`${environment.baseUrl}/api/Account/reset-password` ,data)
    }


}



