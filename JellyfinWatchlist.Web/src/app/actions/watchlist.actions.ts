import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { WatchlistItem } from '../shared/models';

export const WatchlistActions = createActionGroup({
  source: 'Watchlist',
  events: {
    SelectItem: props<{ item: WatchlistItem }>(),
    AddItem: props<{ item: WatchlistItem }>(),
    RemoveItem: props<{ item: WatchlistItem }>(),
    Clear: emptyProps(),
  },
});
