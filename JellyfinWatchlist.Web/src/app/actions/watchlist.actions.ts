import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { WatchlistItem } from '../shared/models';

export const WatchlistActions = createActionGroup({
  source: 'Watchlist',
  events: {
    SelectItem: props<{ item: WatchlistItem }>(),
    AddItem: props<{ item: WatchlistItem }>(),
    AddItemSucceeded: props<{ item: WatchlistItem }>(),
    AddItemFailed: props<{ error: string }>(),
    RemoveItem: props<{ itemId: string }>(),
    RemoveItemSucceeded: props<{ itemId: string }>(),
    RemoveItemFailed: props<{ error: string }>(),
    Clear: emptyProps(),
    LoadWatchlist: emptyProps(),
    LoadWatchlistSucceeded: props<{ items: WatchlistItem[] }>(),
    LoadWatchlistFailed: props<{ error: string }>(),
  },
});
