import { ActionReducerMap, MetaReducer, createSelector } from '@ngrx/store';
import { State as AuthState, authReducer } from './auth.reducer';
import {
  State as CurrentUserState,
  currentUserReducer,
  selectCurrentUser,
} from './current-user.reducer';
import {
  State as SystemInfoState,
  selectPublicSystemInfo,
  systemInfoReducer,
} from './system-info.reducer';

import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';

export interface State {
  auth: AuthState;
  currentUser: CurrentUserState;
  systemInfo: SystemInfoState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  currentUser: currentUserReducer,
  systemInfo: systemInfoReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

export const selectJellyfinServerName = createSelector(
  selectPublicSystemInfo,
  (state) => state?.ServerName ?? environment.jellyfin.baseUrl
);
export const selectCurrentUserName = createSelector(
  selectCurrentUser,
  (state) => state?.Name ?? 'User'
);
