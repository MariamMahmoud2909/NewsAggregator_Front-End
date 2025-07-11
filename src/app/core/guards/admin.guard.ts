import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router)

  if(typeof localStorage !== 'undefined'){
    if(localStorage.getItem('userToken') !== null && localStorage.getItem('userName') == 'Admin'){
      return true;
    }
    else{
      _Router.navigate(['/login']);
      return false;
    }
  }
  else{
    return false;
  }
};
