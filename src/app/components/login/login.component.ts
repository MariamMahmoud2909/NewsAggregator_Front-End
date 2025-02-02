import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/servcies/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  msgError:string = "";
  isLoading:boolean = false;
  name:string = "";


  loginForm:FormGroup = this._FormBuilder.group({
    userName:[null],
    password:[null],
  })

loginSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this._AuthService.setLoginForm(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res);

        // Make sure the token is accessed correctly
        const token = res.token; // The token is inside the response object
        localStorage.setItem('userToken', token); // Save the token to localStorage

        // Save user data or any other necessary details
        this._AuthService.saveUserData();
        this._AuthService.name = this._AuthService.userData.sub;

        const userName = this.loginForm.value.userName;

        if (userName === 'Admin') {
          this._Router.navigate(['/admin']);
        } else {
          this._Router.navigate(['/home']);
        }

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.message;
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}



}
