import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { MediaItem } from '../shared/models';

export const WatchlistActions = createActionGroup({
  source: 'Watchlist',
  events: {
    SelectItem: props<{ item: MediaItem }>(),
    AddItem: props<{ item: MediaItem }>(),
    RemoveItem: props<{ item: MediaItem }>(),
    Clear: emptyProps(),
  },
});
