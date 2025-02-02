import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/servcies/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  // private readonly _LoginComponent = inject(LoginComponent);

  msgError:string = "";
  isLoading:boolean = false;

  registerForm:FormGroup = this._FormBuilder.group({
    firstName:[null,[Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    lastName:[null, [Validators.required, Validators.minLength(3), Validators.maxLength(20) ]],
    email:[null,[Validators.required, Validators.email]],
    userName:[null, [Validators.required]],
    // profilePicUrl:[null],
    password:[null,[Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z]).{6,}$/)]],
    confirmPassword:[null],
  })

//, { validators: this.confirmPassword }

  // confirmPassword( g: AbstractControl ){
  //   if(g.get('password')?.value === g.get('rePassword')?.value)
  //     {
  //       return null
  //     }
  //     else
  //     {
  //       return{mismatch:true}
  //     }
  //   }

    registerSubmit():void
    {
      if(this.registerForm.valid)
      {
        this.isLoading = true;
        this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
          next:(res)=>{
            console.log(res);

            localStorage.setItem('userToken', res.token);

            this._AuthService.saveUserData();
            this._AuthService.name = this._AuthService.userData.sub

            this._Router.navigate(['/categories']);

            this.isLoading = false;
          },
          error:(err:HttpErrorResponse)=>{
            this.msgError = err.error.message;
            console.log(err);
            this.isLoading = false;
          },

        })
      }
      else
      {
        // this.registerForm.setErrors({mismatch:true})
        this.registerForm.markAllAsTouched()
      }



    }

}
