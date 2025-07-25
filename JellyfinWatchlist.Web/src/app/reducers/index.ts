import { ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import { State as AuthState, authReducer } from './auth.reducer';
import { State as CurrentUserState, currentUserReducer, selectUser } from './current-user.reducer';
import { State as SearchState, searchReducer, selectSearchState } from './search.reducer';
import {
  State as SystemInfoState,
  selectPublicSystemInfo,
  systemInfoReducer,
} from './system-info.reducer';
import {
  State as WatchlistState,
  selectAllWatchlist as _selectAllWatchlist,
  selectWatchlistEntities as _selectWatchlistEntities,
  selectWatchlistIds as _selectWatchlistIds,
  selectWatchlistIdsAsStrings as _selectWatchlistIdsAsStrings,
  selectWatchlistTotal as _selectWatchlistTotal,
  watchlistReducer,
} from './watchlist.reducer';

import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';
import { localStorageSyncReducer } from './local-storage-sync.meta-reducer';

export interface State {
  auth: AuthState;
  currentUser: CurrentUserState;
  systemInfo: SystemInfoState;
  search: SearchState;
  watchlist: WatchlistState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  currentUser: currentUserReducer,
  systemInfo: systemInfoReducer,
  search: searchReducer,
  watchlist: watchlistReducer,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sharedMetaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer];
export const metaReducers: MetaReducer<State>[] = isDevMode()
  ? [...sharedMetaReducers] // development mode metareducers
  : [...sharedMetaReducers]; // production mode metareducers

// System Info Selectors
export const selectJellyfinServerName = createSelector(
  selectPublicSystemInfo,
  (state) => state?.ServerName ?? environment.jellyfin.baseUrl,
);

// Current User Selectors
export const selectCurrentUserName = createSelector(selectUser, (state) => state?.Name ?? 'User');
export const selectCurrentUserId = createSelector(selectUser, (state) => state?.Id ?? '');

// Search Selectors
export const selectSearchResults = createSelector(selectSearchState, (state) => state.results);

// Watchlist Selectors
export const selectWatchlistState = createFeatureSelector<WatchlistState>('watchlist');

export const selectWatchlistIds = createSelector(selectWatchlistState, _selectWatchlistIds);

export const selectWatchlistIdsAsStrings = createSelector(
  selectWatchlistState,
  _selectWatchlistIdsAsStrings,
);

export const selectWatchlistEntities = createSelector(
  selectWatchlistState,
  _selectWatchlistEntities,
);

export const selectAllWatchlist = createSelector(selectWatchlistState, _selectAllWatchlist);

export const selectWatchlistTotal = createSelector(selectWatchlistState, _selectWatchlistTotal);
