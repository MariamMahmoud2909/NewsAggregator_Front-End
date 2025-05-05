import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/servcies/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _ToastrService = inject(ToastrService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  msgError:string = "";
  isLoading:boolean = false;
  passwordError: string = "";

  loginForm:FormGroup = this._FormBuilder.group({
    userName:[null],
    password:[null],
  })

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.msgError = "";
      this.passwordError = "";
      
      // Check if the account was previously marked for deletion
      const wasDeactivated = localStorage.getItem('wasDeactivated');
      if (wasDeactivated === 'true') {
        localStorage.removeItem('wasDeactivated');
        this._ToastrService.success('Your account deletion request has been canceled! Welcome back!', 'Account Restored');
      }

      this._AuthService.setLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);

          // Make sure the token is accessed correctly
          const token = res.token; // The token is inside the response object
          localStorage.setItem('userToken', token); // Save the token to localStorage

          // Save user data or any other necessary details
          this._AuthService.saveUserData();
          this._AuthService.name = this._AuthService.userData.sub;

          localStorage.setItem('userName', this._AuthService.userData.sub);
          
          // Check if this is a deletion cancellation within 14 days
          const reactivationWithin14Days = localStorage.getItem('reactivationWithin14Days');
          if (reactivationWithin14Days === 'true') {
            this._ToastrService.success('Login successful. Deletion request canceled.', 'Account Restored');
            localStorage.removeItem('reactivationWithin14Days');
          } 
          // Display the message from the backend if it exists
          else if (res.message) {
            this._ToastrService.success(res.message, 'Success');
          }

          const userName = this.loginForm.value.userName;

          if (userName === 'Admin') {
            this._Router.navigate(['/admin']);
          } else {
            this._Router.navigate(['/home']);
          }

          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.isLoading = false;
          
          if (err.error.message) {
            this.msgError = err.error.message;
            this._ToastrService.error(this.msgError, 'Failed');
          } else if (err.error === 'Account is deactivated') {
            this.msgError = "Your account has been deactivated. Please contact support.";
            this._ToastrService.error(this.msgError, 'Account Deactivated');
            localStorage.setItem('wasDeactivated', 'true');
          } else {
            this.msgError = "Invalid username or password";
            this._ToastrService.error(this.msgError, 'Login Failed');
            this.passwordError = "Incorrect password. Please try again.";
          }
        },
      });
    }
  }
}
