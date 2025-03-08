import * as JellyfinActions from '../actions/jellyfin.actions';

import {
  PublicSystemInfo,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface State {
  publicSystemInfo: PublicSystemInfo | null;
  currentUser: UserDto | null;
  loading: boolean;
}

const initialState: State = {
  publicSystemInfo: null,
  currentUser: null,
  loading: false,
};

export const jellyfinReducer = createReducer(
  initialState,
  on(JellyfinActions.getSystemInfo, (state) => ({
    ...state,
    loading: true,
  })),
  on(JellyfinActions.getSystemInfoSucceeded, (state, { systemInfo }) => ({
    ...state,
    publicSystemInfo: systemInfo,
    loading: false,
  })),
  on(JellyfinActions.getSystemInfoFailed, (state) => ({
    ...state,
    publicSystemInfo: null,
    loading: false,
  })),
  on(JellyfinActions.getCurrentUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(JellyfinActions.getCurrentUserSucceeded, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
  })),
  on(JellyfinActions.getCurrentUserFailed, (state) => ({
    ...state,
    currentUser: null,
    loading: false,
  }))
);

const jellyfinFeature = createFeature({
  name: 'jellyfin',
  reducer: jellyfinReducer,
});

export const {
  name,
  reducer,
  selectJellyfinState,
  selectPublicSystemInfo,
  selectCurrentUser,
  selectLoading,
} = jellyfinFeature;
