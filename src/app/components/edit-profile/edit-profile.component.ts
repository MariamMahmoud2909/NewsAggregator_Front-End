import { Component, inject, OnInit } from '@angular/core';
import { UserServiceService } from '../../core/servcies/user-service.service';
import { IUserInfo } from '../../core/interfaces/iuser-info';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/servcies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {



  private readonly _ToastrService = inject(ToastrService);
  private readonly _UserServiceService = inject(UserServiceService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);


  userInfo: IUserInfo[] = [];
  un:string='';
  isLoading:boolean = false;
  pp:string = '';


  ngOnInit(): void {
    this.getuserDate();
  }

  getuserDate():void{
    this._UserServiceService.getUserInfo().subscribe({
      next: (res) => {
        console.log(res);
        this.userInfo = [res];
        this.updateForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          username: res.userName,
          email: res.email,
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // ngOnChanges(): void {
  //   this._UserServiceService.getUserInfo().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.userInfo = [res];
  //       this.un= res.userName;
  //       console.log("from on changes");
  //       console.log(this.userInfo);
  //       console.log(this.un);
  //       // this.updateForm.patchValue({
  //       //   firstName: res.firstName,
  //       //   lastName: res.lastName,
  //       //   username: res.userName,
  //       //   email: res.email,
  //       // });
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });

  // }




  updateForm: FormGroup = this._FormBuilder.group({
    firstName: [null],
    lastName: [null],
    ProfilePicUrl: [null],
    username: [null],
    email: [null],
    oldPassword: [null],
    newPassword: [null],
    confirmNewPassword: [null],
  }, {
    // validators: [
    //   this.confirmPassword,
    //   this.atLeastOneFieldFilled()
    // ]
  });


  confirmPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  atLeastOneFieldFilled(): ValidatorFn {
    return (group: AbstractControl) => {
      const fields = ['firstName', 'lastName', 'email', 'userName', 'password', 'confirmPassword', 'oldPassword'];
      const hasValue = fields.some(field => group.get(field)?.value?.trim());

      const password = group.get('password')?.value?.trim();
      const confirmPassword = group.get('confirmPassword')?.value?.trim();

      if (password && !confirmPassword) {
        return { confirmPasswordRequired: true };
      }

      return hasValue ? null : { atLeastOneRequired: true };
    };
  }




  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.updateForm.patchValue({ ProfilePicUrl: file });  // Patch the file to the form

      // Generate preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.pp = reader.result as string;  // Update the preview image
      };
      reader.readAsDataURL(file);

      console.log('Selected file:', file);
    } else {
      console.log('No file selected.');
    }
  }








  updateSubmit(): void {
    this.isLoading = true;
    const formData = new FormData();

    // Append only non-null values (excluding file)
    Object.keys(this.updateForm.value).forEach((key) => {
      const value = this.updateForm.value[key];
      if (value && key !== 'ProfilePicUrl') {
        formData.append(key, value);
      }
    });

    // Append the profile picture if a file is selected
    const fileInput = this.updateForm.get('ProfilePicUrl')?.value;
    if (fileInput && fileInput instanceof File) {
      formData.append('ProfilePicUrl', fileInput, fileInput.name);
    }

    // **Debugging: Log FormData contents**
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Ensure `oldPassword` is included only if `newPassword` exists
    if (!this.updateForm.value.newPassword) {
      formData.delete('oldPassword');
    }

    this._UserServiceService.setUpdateForm(formData).subscribe({
      next: (res) => {
        console.log('Profile updated successfully:', res);
        this.isLoading = false;

        // Update the username in local storage
        const newUserName = this.updateForm.value.username;
        if (newUserName) {
          localStorage.setItem('userName', newUserName); // Directly update local storage
        }

      },
      error: (err: HttpErrorResponse) => {
        console.log('Update failed:', err);
        this.isLoading = false;
      },
    });
  }

  deactivateAccount(): void {
    if (confirm('Are you sure you want to request account deletion? You can cancel this request by logging in again within 14 days.')) {
      this.isLoading = true;
      this._UserServiceService.deactivateAccount().subscribe({
        next: (res) => {
          // Show success message based on response type
          if (res.message && res.message.includes('client-side')) {
            this._ToastrService.success('Account deletion requested successfully. You can cancel this request by logging in again.');
          } else {
            this._ToastrService.success('Account deletion requested successfully. You can cancel this request by logging in again within 14 days.');
          }
          
          // Clear storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        },
        error: (err: HttpErrorResponse) => {
          // Handle various error cases with appropriate messages
          let errorMessage = 'Failed to request account deletion. ';
          if (err.status === 401) {
            errorMessage += 'Your session has expired. Please login again.';
          } else if (err.status === 403) {
            errorMessage += 'You do not have permission to perform this action.';
          } else if (err.status === 404) {
            errorMessage += 'The deletion service is not available.';
          }
          this._ToastrService.error(errorMessage, 'Error');
        }
      });
    }
  }

  // isFormValid(): boolean {
  //   return this.updateForm.valid;
  // }

}
