import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { WatchlistItem } from '../shared/models';

export const SearchActions = createActionGroup({
  source: 'Search',
  events: {
    Search: props<{ query: string }>(),
    SearchSucceeded: props<{ results: WatchlistItem[] }>(),
    SearchFailed: emptyProps(),
    Clear: emptyProps(),
  },
});
