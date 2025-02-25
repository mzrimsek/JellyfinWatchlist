import { CanActivateFn, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { selectIsAuthenticated } from '../reducers/jellyfin.reducer';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        inject(Router).navigate(['/login']);
      }
    })
  );
};
