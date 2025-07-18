import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';
import { SystemInfoActions } from '../actions/system-info.actions';

@Injectable()
export class SystemInfoEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);

  getSystemInfoActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SystemInfoActions.get),
      exhaustMap(() =>
        this.jellyfinService.getSystemInfo().pipe(
          map((systemInfo) => SystemInfoActions.getSucceeded({ systemInfo })),
          catchError(() => of(SystemInfoActions.getFailed())),
        ),
      ),
    );
  });

  getSystemInfoFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SystemInfoActions.getFailed),
        map(() => {
          console.log('Failed to get system info');
        }),
      );
    },
    { dispatch: false },
  );
}
