import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/servcies/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-forgetpassword',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './forgetpassword.component.html',
    styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent {

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  step:number = 1;
  isLoading:boolean = false;

  forgetpasswordForm:FormGroup = this._FormBuilder.group({
    email:[null,[Validators.required, Validators.email]],
  })

  verficationcodeForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    verificationCode: [null, Validators.required],
  });


  resetpasswordForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]], // Initialize as null
    verificationCode: [null, Validators.required],         // Initialize as null
    newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z]).{6,}$/)]],
    // rePassword: [null, Validators.required],
  });

  //, { validators: this.confirmPassword }

    // confirmPassword( g: AbstractControl ){
    // if(g.get('password')?.value === g.get('rePassword')?.value)
    //   {
    //     return null;
    //   }
    //   else
    //   {
    //     return{mismatch:true}
    //   }
    // }

    forgetpasswordSubmit(): void {
      if (this.forgetpasswordForm.valid) {
        this.isLoading = true;
        this._AuthService.setforgetpasswordForm(this.forgetpasswordForm.value).subscribe({
          next: (res) => {
            const email = this.forgetpasswordForm.get('email')?.value;
            this.verficationcodeForm.patchValue({ email });
            console.log(res);
            this.step = 2;
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isLoading = false;
          },
        });
      }
    }


    verificationCodeSubmit(): void {
      if (this.verficationcodeForm.valid) {
        this.isLoading = true;
        this._AuthService.verificationCodeForm(this.verficationcodeForm.value).subscribe({
          next: (res) => {
            console.log(res);
            const email = this.verficationcodeForm.get('email')?.value;
            const verificationCode = this.verficationcodeForm.get('verificationCode')?.value;
            this.resetpasswordForm.patchValue({ email, verificationCode });

            this.step = 3;
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isLoading = false;
          },
        });
      }
    }


    resetpasswordSubmit(): void {
      if (this.resetpasswordForm.valid) {
        this.isLoading = true;
        this._AuthService.resetpaswordForm(this.resetpasswordForm.value).subscribe({
          next: (res) => {
            console.log(res);
            localStorage.setItem('userToken', res.token);
            this._AuthService.saveUserData();
            this._Router.navigate(['/home']);
            this.step = 1;
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isLoading = false;
          },
        });
      }
    }

}
