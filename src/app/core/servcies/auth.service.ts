import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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


  setRegisterForm(data:object):Observable<any>
  {
    return this._HttpClient.post(`${environment.baseUrl}/api/Account/register` ,data)
  }

  setLoginForm(data:object):Observable<any>
  {
    return this._HttpClient.post(`${environment.baseUrl}/api/account/login` ,data)
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



