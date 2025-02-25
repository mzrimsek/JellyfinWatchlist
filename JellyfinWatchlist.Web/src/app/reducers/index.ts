import { ActionReducerMap, MetaReducer, createSelector } from '@ngrx/store';
import {
  State as JellyfinState,
  jellyfinReducer,
  selectCurrentUser,
  selectPublicSystemInfo,
} from './jellyfin.reducer';

import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';

export interface State {
  jellyfin: JellyfinState;
}

export const reducers: ActionReducerMap<State> = {
  jellyfin: jellyfinReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectJellyfinServerName = createSelector(
  selectPublicSystemInfo,
  (state) => state?.ServerName ?? environment.jellyfin.baseUrl
);
export const selectJellyfinUserName = createSelector(
  selectCurrentUser,
  (state) => state?.Name ?? 'User'
);
