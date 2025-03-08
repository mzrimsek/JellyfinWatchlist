import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models';

export const SystemInfoActions = createActionGroup({
  source: 'System Info',
  events: {
    Get: emptyProps(),
    GetSucceeded: props<{ systemInfo: PublicSystemInfo }>(),
    GetFailed: emptyProps(),
  },
});
