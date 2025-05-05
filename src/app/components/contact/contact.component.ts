import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/servcies/contact.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contact',
    imports: [ReactiveFormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {

    private readonly _ContactService = inject(ContactService);
    private readonly _FormBuilder = inject(FormBuilder);
    private readonly _ToastrService = inject(ToastrService);

    isLoading:boolean = false;

      contactForm:FormGroup = this._FormBuilder.group({
        fullName:[null, [Validators.required]],
        email:[null,[Validators.required, Validators.email]],
        subject:[null, [Validators.required]],
        message:[null, [Validators.required]]
      })

      contactSubmit():void
          {
            this.isLoading = true;
            this._ContactService.setContactForm(this.contactForm.value).subscribe({
              next:(res)=>{
                console.log(res);
                this._ToastrService.success(res.message, 'Success')
                this.contactForm.reset();
                this.isLoading = false;
              },
              error:(err:HttpErrorResponse)=>{
                let msgError = err.error.message;
                this._ToastrService.error(msgError, 'Failed')
                console.log(err);
                this.isLoading = false;
              },
            })
          }

}
