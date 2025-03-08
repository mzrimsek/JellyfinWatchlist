import {
  PublicSystemInfo,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';
import { createAction, props } from '@ngrx/store';

export const getCurrentUser = createAction('[Jellyfin] Get Current User');
export const getCurrentUserSucceeded = createAction(
  '[Jellyfin] Get Current User Succeeded',
  props<{ user: UserDto }>()
);
export const getCurrentUserFailed = createAction(
  '[Jellyfin] Get Current User Failed'
);

export const getSystemInfo = createAction('[Jellyfin] Get System Info');
export const getSystemInfoSucceeded = createAction(
  '[Jellyfin] Get System Info Succeeded',
  props<{ systemInfo: PublicSystemInfo }>()
);
export const getSystemInfoFailed = createAction(
  '[Jellyfin] Get System Info Failed'
);
