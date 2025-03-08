import * as systemInfoActions from '../actions/system-info.actions';

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
      ofType(systemInfoActions.getSystemInfo),
      exhaustMap(() =>
        this.jellyfinService.getSystemInfo().pipe(
          map((systemInfo) =>
            systemInfoActions.getSystemInfoSucceeded({ systemInfo })
          ),
          catchError(() => of(systemInfoActions.getSystemInfoFailed()))
        )
      )
    );
  });

  getSystemInfoFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(systemInfoActions.getSystemInfoFailed),
        map(() => {
          console.log('Failed to get system info');
        })
      );
    },
    { dispatch: false }
  );
}
