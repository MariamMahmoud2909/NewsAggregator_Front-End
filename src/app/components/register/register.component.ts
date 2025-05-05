import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/servcies/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly _ToastrService = inject(ToastrService);
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
    profilePicUrl:[null],
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

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.registerForm.patchValue({ profilePicUrl: fileInput.files[0] });
      this.registerForm.get('profilePicUrl')?.updateValueAndValidity(); // Ensure validation updates
    }
  }



  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      // Convert form values to FormData for file upload
      const formData = new FormData();

      // Append form fields (excluding file)
      Object.keys(this.registerForm.value).forEach(key => {
        const value = this.registerForm.value[key];
        if (value && key !== 'profilePicUrl') {
          formData.append(key, value);
        }
      });

      // Append the file (if selected)
      const fileInput = this.registerForm.get('profilePicUrl')?.value;
      if (fileInput && fileInput instanceof File) {
        formData.append('profilePicUrl', fileInput, fileInput.name);
      }

      // Debug: Check the FormData content
      // Debug: Check the FormData content
      // for (let pair of (formData as any).entries()) {
      //   console.log(pair[0], pair[1]); // Debugging: Check values being sent
      // }

      formData.forEach((value, key) => {
        console.log(key, value);
      });



      this._AuthService.setRegisterForm(formData).subscribe({
        next: (res) => {
          console.log(res);
          localStorage.setItem('userToken', res.token);
          localStorage.setItem('userName', this.registerForm.value.userName)
          const userName = this.registerForm.value.userName;
          if (userName === 'Admin') {
            this._Router.navigate(['/admin']);
          } else {
            this._Router.navigate(['/categories']);
          }
          // this._Router.navigate(['/categories']);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message;
          this._ToastrService.error(this.msgError, 'Failed');
          console.log(err);
          this.isLoading = false;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }



}
