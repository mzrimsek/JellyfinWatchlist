import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { selectAccessToken } from '../reducers/auth.reducer';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAccessToken).pipe(
    map((accessToken) => accessToken !== null),
    tap((accessToken) => {
      if (!accessToken) {
        router.navigate(['/login']);
      }
    }),
  );
};
