import { ActionReducerMap, MetaReducer, createSelector } from '@ngrx/store';
import { State as AuthState, authReducer } from './auth.reducer';
import {
  State as CurrentUserState,
  currentUserReducer,
  selectUser,
} from './current-user.reducer';
import {
  State as SearchState,
  searchReducer,
  selectSearchState,
} from './search.reducer';
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
  search: SearchState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  currentUser: currentUserReducer,
  systemInfo: systemInfoReducer,
  search: searchReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

// System Info Selectors
export const selectJellyfinServerName = createSelector(
  selectPublicSystemInfo,
  (state) => state?.ServerName ?? environment.jellyfin.baseUrl
);

// Current User Selectors
export const selectCurrentUserName = createSelector(
  selectUser,
  (state) => state?.Name ?? 'User'
);
export const selectCurrentUserId = createSelector(
  selectUser,
  (state) => state?.Id ?? ''
);

// Search Selectors
export const selectSearchResults = createSelector(
  selectSearchState,
  (state) => state.results
);
