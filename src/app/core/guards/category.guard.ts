import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CategoriesService } from '../servcies/categories.service';

export const categoryGuard: CanActivateFn = (route, state) => {
  const _CategoriesService = inject(CategoriesService);
  const router = inject(Router);

  // ✅ Get the logged-in user ID
  const userId = localStorage.getItem('userId');
  if (userId) {
    _CategoriesService.resetSelectedCategoriesForUser(userId);
  }

  let selectedCategoriesCount = 0;
  _CategoriesService.selectedCategoriesCount$.subscribe(count => {
    selectedCategoriesCount = count;
  });

  const isNewUser = localStorage.getItem('isNewUser') === 'true';

  if (isNewUser && selectedCategoriesCount < 3) {
    router.navigate(['/categories']);
    return false;
  }

  return true;

};
