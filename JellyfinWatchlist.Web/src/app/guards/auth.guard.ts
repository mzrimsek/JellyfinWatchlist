import { CanActivateFn, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { selectIsAuthenticated } from '../reducers/auth.reducer';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
      }
    })
  );
};
