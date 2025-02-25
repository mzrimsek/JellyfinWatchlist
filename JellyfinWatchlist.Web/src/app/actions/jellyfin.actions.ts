import {
  PublicSystemInfo,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Jellyfin] Login',
  props<{ username: string; password: string }>()
);
export const loginSucceeded = createAction('[Jellyfin] Login Succeeded');
export const loginFailed = createAction('[Jellyfin] Login Failed');

export const logout = createAction('[Jellyfin] Logout');

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
