import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { MediaItem } from '../shared/models';

export const SearchActions = createActionGroup({
  source: 'Search',
  events: {
    Search: props<{ query: string }>(),
    SearchSucceeded: props<{ results: MediaItem[] }>(),
    SearchFailed: emptyProps(),
    Clear: emptyProps(),
  },
});
