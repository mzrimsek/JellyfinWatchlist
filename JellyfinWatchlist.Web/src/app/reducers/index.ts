import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { State as JellyfinState, jellyfinReducer } from './jellyfin.reducer';

import { isDevMode } from '@angular/core';

export interface State {
  jellyfin: JellyfinState;
}

export const reducers: ActionReducerMap<State> = {
  jellyfin: jellyfinReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
