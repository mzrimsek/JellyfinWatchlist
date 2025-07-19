import { inject, Injectable } from '@angular/core';

import { WatchlistActions } from '../actions/watchlist.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { State, selectWatchlistIds } from '../reducers';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { WatchlistService } from '../services/watchlist.service';
import { selectUser } from '../reducers/current-user.reducer';

@Injectable()
export class WatchlistEffects {
  private actions$ = inject(Actions);
  private store$ = inject(Store<State>);
  private watchlistService = inject(WatchlistService);

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
        return of(WatchlistActions.removeItem({ itemId: item.id }));
      }),
    );
  });

  addItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WatchlistActions.addItem),
      concatLatestFrom(() => this.store$.select(selectUser)),
      exhaustMap(([action, currentUser]) => {
        const { item } = action;
        if (!currentUser || !currentUser.Id) {
          return of(WatchlistActions.addItemFailed({ error: 'User not logged in' }));
        }
        return this.watchlistService.addWatchlistItem(currentUser.Id, item).pipe(
          map(() => WatchlistActions.addItemSucceeded({ item })),
          catchError((error) => of(WatchlistActions.addItemFailed({ error }))),
        );
      }),
    );
  });

  removeItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WatchlistActions.removeItem),
      concatLatestFrom(() => this.store$.select(selectUser)),
      exhaustMap(([action, currentUser]) => {
        const { itemId } = action;
        if (!currentUser || !currentUser.Id) {
          return of(WatchlistActions.removeItemFailed({ error: 'User not logged in' }));
        }
        return this.watchlistService.removeWatchlistItem(currentUser.Id, itemId).pipe(
          map(() => WatchlistActions.removeItemSucceeded({ itemId })),
          catchError((error) => of(WatchlistActions.removeItemFailed({ error }))),
        );
      }),
    );
  });

  loadWatchlist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WatchlistActions.loadWatchlist),
      concatLatestFrom(() => this.store$.select(selectUser)),
      exhaustMap(([action, currentUser]) => {
        if (!currentUser || !currentUser.Id) {
          return of(WatchlistActions.loadWatchlistFailed({ error: 'User not logged in' }));
        }
        return this.watchlistService.getWatchlist(currentUser.Id).pipe(
          map((items) => WatchlistActions.loadWatchlistSucceeded({ items })),
          catchError((error) => of(WatchlistActions.loadWatchlistFailed({ error }))),
        );
      }),
    );
  });
}
