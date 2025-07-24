import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { CurrentUserActions } from '../actions/current-user.actions';
import { JellyfinService } from '../services/jellyfin.service';
import { WatchlistActions } from '../actions/watchlist.actions';

@Injectable()
export class CurrentUserEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);

  getCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentUserActions.get),
      exhaustMap(() =>
        this.jellyfinService.getCurrentUser().pipe(
          map((user) => CurrentUserActions.getSucceeded({ user })),
          catchError(() => of(CurrentUserActions.getFailed())),
        ),
      ),
    );
  });

  getCurrentUserFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CurrentUserActions.getFailed),
        map(() => {
          console.log('Failed to get current user');
        }),
      );
    },
    { dispatch: false },
  );
}
