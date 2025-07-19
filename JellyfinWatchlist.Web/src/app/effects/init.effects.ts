import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';

import { SystemInfoActions } from '../actions/system-info.actions';
import { WatchlistActions } from '../actions/watchlist.actions';
import { map } from 'rxjs';

@Injectable()
export class InitEffects {
  private actions$ = inject(Actions);

  loadWatchlist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => WatchlistActions.loadWatchlist()),
    );
  });

  getSystemInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => SystemInfoActions.get()),
    );
  });
}
