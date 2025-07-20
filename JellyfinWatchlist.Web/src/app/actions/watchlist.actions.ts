import { SelectWatchlistItemPayload, WatchlistItem } from '../shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WatchlistActions = createActionGroup({
  source: 'Watchlist',
  events: {
    SelectItem: props<{ payload: SelectWatchlistItemPayload }>(),
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
