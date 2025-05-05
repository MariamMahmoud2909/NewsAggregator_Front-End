import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const _NgxSpinnerService = inject(NgxSpinnerService);

  if (!req.url.includes('/api/UserTwo/get-notifications')) {
    _NgxSpinnerService.show();
  }


  return next(req).pipe(
    finalize(() => {
      setTimeout(() => {
        _NgxSpinnerService.hide();
      }, 100); // Hide after 3 seconds
    })
  );
};
