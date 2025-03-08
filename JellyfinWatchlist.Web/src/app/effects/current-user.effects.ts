import * as CurrentUserActions from '../actions/current-user.actions';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';

@Injectable()
export class CurrentUserEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);

  getCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentUserActions.getCurrentUser),
      exhaustMap(() =>
        this.jellyfinService.getCurrentUser().pipe(
          map((user) => CurrentUserActions.getCurrentUserSucceeded({ user })),
          catchError(() => of(CurrentUserActions.getCurrentUserFailed()))
        )
      )
    );
  });

  getCurrentUserFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CurrentUserActions.getCurrentUserFailed),
        map(() => {
          console.log('Failed to get current user');
        })
      );
    },
    { dispatch: false }
  );
}
