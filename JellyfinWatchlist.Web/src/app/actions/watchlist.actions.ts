import { createAction, props } from '@ngrx/store';

import { MediaItem } from '../shared/models';

export const watchlistAddItem = createAction(
  '[Watchlist] Add Item',
  props<{ item: MediaItem }>()
);
export const watchlistRemoveItem = createAction(
  '[Watchlist] Remove Item',
  props<{ item: MediaItem }>()
);
export const watchlistClear = createAction('[Watchlist] Clear');
