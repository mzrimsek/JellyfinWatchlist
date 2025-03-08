import * as jellyfinActions from '../actions/jellyfin.actions';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';

@Injectable()
export class CurrentUserEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);

  getCurrentUserActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(jellyfinActions.getCurrentUser),
      exhaustMap(() =>
        this.jellyfinService.getCurrentUser().pipe(
          map((user) => jellyfinActions.getCurrentUserSucceeded({ user })),
          catchError(() => of(jellyfinActions.getCurrentUserFailed()))
        )
      )
    );
  });

  getCurrentUserFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(jellyfinActions.getCurrentUserFailed),
        map(() => {
          console.log('Failed to get current user');
        })
      );
    },
    { dispatch: false }
  );
}
