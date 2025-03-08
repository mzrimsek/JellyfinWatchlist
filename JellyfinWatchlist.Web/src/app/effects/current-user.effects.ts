import * as currentUserActions from '../actions/current-user.actions';

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
      ofType(currentUserActions.getCurrentUser),
      exhaustMap(() =>
        this.jellyfinService.getCurrentUser().pipe(
          map((user) => currentUserActions.getCurrentUserSucceeded({ user })),
          catchError(() => of(currentUserActions.getCurrentUserFailed()))
        )
      )
    );
  });

  getCurrentUserFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(currentUserActions.getCurrentUserFailed),
        map(() => {
          console.log('Failed to get current user');
        })
      );
    },
    { dispatch: false }
  );
}
