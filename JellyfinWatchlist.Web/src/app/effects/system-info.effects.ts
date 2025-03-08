import * as jellyfinActions from '../actions/jellyfin.actions';

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
      ofType(jellyfinActions.getSystemInfo),
      exhaustMap(() =>
        this.jellyfinService.getSystemInfo().pipe(
          map((systemInfo) =>
            jellyfinActions.getSystemInfoSucceeded({ systemInfo })
          ),
          catchError(() => of(jellyfinActions.getSystemInfoFailed()))
        )
      )
    );
  });
}
