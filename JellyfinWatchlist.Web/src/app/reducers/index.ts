import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { State as JellyfinState, jellyfinReducer } from './jellyfin.reducer';

import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';

export interface State {
  jellyfin: JellyfinState;
}

export const reducers: ActionReducerMap<State> = {
  jellyfin: jellyfinReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectJellyfin = (state: State) => state.jellyfin;
export const selectJellyfinIsAuthenticated = createSelector(
  selectJellyfin,
  (state) => state.isAuthenticated
);
const selectJellyfinPublicSystemInfo = createSelector(
  selectJellyfin,
  (state) => state.publicSystemInfo
);
export const selectJellyfinServerName = createSelector(
  selectJellyfinPublicSystemInfo,
  (state) => state?.ServerName ?? environment.jellyfin.baseUrl
);
const selectJellyfinCurrentUser = createSelector(
  selectJellyfin,
  (state) => state.currentUser
);
export const selectJellyfinUserName = createSelector(
  selectJellyfinCurrentUser,
  (state) => state?.Name ?? 'User'
);
