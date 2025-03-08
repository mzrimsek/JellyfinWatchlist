import * as searchActions from '../actions/search.actions';
import { State, selectCurrentUserId } from '../reducers';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class SearchEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<State>);
  private jellyfinService = inject(JellyfinService);
  private matSnackBar = inject(MatSnackBar);

  searchActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchActions.search),
      concatLatestFrom((_action) => this.store.select(selectCurrentUserId)),
      exhaustMap(([action, currentUserId]) =>
        this.jellyfinService.search(action.query, currentUserId).pipe(
          map((results) => searchActions.searchSucceeded({ results })),
          catchError(() => of(searchActions.searchFailed()))
        )
      )
    );
  });

  searchFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(searchActions.searchFailed),
        map(() => {
          this.matSnackBar.open('Search failed', 'Dismiss', {
            duration: 3000,
          });
        })
      );
    },
    { dispatch: false }
  );
}
