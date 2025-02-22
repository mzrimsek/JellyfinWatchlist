import { CanActivateFn, Router } from '@angular/router';

import { JellyfinService } from '../services/jellyfin.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(JellyfinService).isAuthenticated;
  if (!isAuthenticated) {
    inject(Router).navigate(['/login']);
  }
  return true;
};
