import { createAction, props } from '@ngrx/store';

import { SearchHintResult } from '@jellyfin/sdk/lib/generated-client/models';

export const search = createAction(
  '[Search] Search',
  props<{ query: string }>()
);
export const searchSucceeded = createAction(
  '[Search] Search Succeeded',
  props<{ results: SearchHintResult }>()
);
export const searchFailed = createAction('[Search] Search Failed');
