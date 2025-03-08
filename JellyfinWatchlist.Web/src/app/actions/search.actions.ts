import { createAction, props } from '@ngrx/store';

import { SearchResult } from '../pages/search/models';

export const search = createAction(
  '[Search] Search',
  props<{ query: string }>()
);
export const searchSucceeded = createAction(
  '[Search] Search Succeeded',
  props<{ results: Array<SearchResult> }>()
);
export const searchFailed = createAction('[Search] Search Failed');
