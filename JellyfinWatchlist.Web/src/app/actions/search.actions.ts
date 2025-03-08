import { createAction, props } from '@ngrx/store';

import { MediaItem } from '../shared/models';

export const search = createAction(
  '[Search] Search',
  props<{ query: string }>()
);
export const searchSucceeded = createAction(
  '[Search] Search Succeeded',
  props<{ results: Array<MediaItem> }>()
);
export const searchFailed = createAction('[Search] Search Failed');
export const clearSearch = createAction('[Search] Clear Search');
