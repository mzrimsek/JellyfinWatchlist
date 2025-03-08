import * as SystemInfoActions from '../actions/system-info.actions';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';

@Injectable()
export class SystemInfoEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);

  getSystemInfoActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SystemInfoActions.getSystemInfo),
      exhaustMap(() =>
        this.jellyfinService.getSystemInfo().pipe(
          map((systemInfo) =>
            SystemInfoActions.getSystemInfoSucceeded({ systemInfo })
          ),
          catchError(() => of(SystemInfoActions.getSystemInfoFailed()))
        )
      )
    );
  });

  getSystemInfoFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SystemInfoActions.getSystemInfoFailed),
        map(() => {
          console.log('Failed to get system info');
        })
      );
    },
    { dispatch: false }
  );
}
