import { createAction, props } from '@ngrx/store';

import { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models';

export const getSystemInfo = createAction('[System Info] Get System Info');
export const getSystemInfoSucceeded = createAction(
  '[System Info] Get System Info Succeeded',
  props<{ systemInfo: PublicSystemInfo }>()
);
export const getSystemInfoFailed = createAction(
  '[System Info] Get System Info Failed'
);
