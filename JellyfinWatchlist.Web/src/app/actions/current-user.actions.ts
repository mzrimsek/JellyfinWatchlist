import { createAction, props } from '@ngrx/store';

import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

export const getCurrentUser = createAction('[Current User] Get Current User');
export const getCurrentUserSucceeded = createAction(
  '[Current User] Get Current User Succeeded',
  props<{ user: UserDto }>()
);
export const getCurrentUserFailed = createAction(
  '[Current User] Get Current User Failed'
);
export const clearCurrentUser = createAction(
  '[Current User] Clear Current User'
);
