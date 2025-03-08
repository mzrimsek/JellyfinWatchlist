import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

export const CurrentUserActions = createActionGroup({
  source: 'Current User',
  events: {
    Get: emptyProps(),
    GetSucceeded: props<{ user: UserDto }>(),
    GetFailed: emptyProps(),
    Clear: emptyProps(),
  },
});
