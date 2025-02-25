import * as JellyfinActions from '../actions/jellyfin.actions';

import {
  PublicSystemInfo,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface State {
  isAuthenticated: boolean;
  publicSystemInfo: PublicSystemInfo | null;
  currentUser: UserDto | null;
  loading: boolean;
}

const initialState: State = {
  isAuthenticated: false,
  publicSystemInfo: null,
  currentUser: null,
  loading: false,
};

export const jellyfinReducer = createReducer(
  initialState,
  on(JellyfinActions.login, (state) => ({
    ...state,
    loading: true,
  })),
  on(JellyfinActions.loginSucceeded, (state) => ({
    ...state,
    isAuthenticated: true,
    loading: false,
  })),
  on(JellyfinActions.loginFailed, (state) => ({
    ...state,
    isAuthenticated: false,
    loading: false,
  })),
  on(JellyfinActions.logout, (state) => ({
    ...state,
    isAuthenticated: false,
  })),
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
  selectIsAuthenticated,
  selectPublicSystemInfo,
  selectCurrentUser,
  selectLoading,
} = jellyfinFeature;
