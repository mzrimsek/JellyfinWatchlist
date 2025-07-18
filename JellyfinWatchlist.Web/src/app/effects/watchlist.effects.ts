import { inject, Injectable } from '@angular/core';

import { WatchlistActions } from '../actions/watchlist.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { State, selectWatchlistIds } from '../reducers';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { exhaustMap, of } from 'rxjs';

@Injectable()
export class WatchlistEffects {
  private actions$ = inject(Actions);
  private store$ = inject(Store<State>);

  itemSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WatchlistActions.selectItem),
      concatLatestFrom(() => this.store$.select(selectWatchlistIds)),
      exhaustMap(([action, watchlistIds]) => {
        const { item } = action;
        const stringifiedWatchlistIds = watchlistIds.map((id) => id.toString());
        const itemContainedInWatchlist = stringifiedWatchlistIds.includes(item.id);
        if (!itemContainedInWatchlist) {
          return of(WatchlistActions.addItem({ item }));
        }
        return of(WatchlistActions.removeItem({ item }));
      }),
    );
  });
}
