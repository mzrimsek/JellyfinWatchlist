import { SearchActions } from '../actions/search.actions';
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
      ofType(SearchActions.search),
      concatLatestFrom(() => this.store.select(selectCurrentUserId)),
      exhaustMap(([action, currentUserId]) => {
        return this.jellyfinService.search(action.query, currentUserId).pipe(
          map((results) => {
            const mappedResults =
              results.SearchHints?.map((result) => {
                if (
                  !result.Id ||
                  !result.Name ||
                  !result.Type ||
                  !result.ProductionYear ||
                  !result.PrimaryImageTag
                ) {
                  throw new Error('Search Result is missing expected properties');
                }
                const primaryImageUrl = this.jellyfinService.getItemPrimaryImageUrl(
                  result.Id,
                  result.PrimaryImageTag,
                );
                return {
                  id: result.Id,
                  name: result.Name,
                  mediaType: result.Type,
                  year: result.ProductionYear,
                  primaryImageUrl,
                };
              }) ?? [];
            return SearchActions.searchSucceeded({ results: mappedResults });
          }),
          catchError(() => of(SearchActions.searchFailed())),
        );
      }),
    );
  });

  searchFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SearchActions.searchFailed),
        map(() => {
          this.matSnackBar.open('Search failed', 'Dismiss', {
            duration: 3000,
          });
        }),
      );
    },
    { dispatch: false },
  );
}
