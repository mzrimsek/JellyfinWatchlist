import * as JellyfinActions from '../actions/jellyfin.actions';

import {
  PublicSystemInfo,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';
import { createReducer, on } from '@ngrx/store';

export interface State {
  isAuthenticated: boolean;
  publicSystemInfo: PublicSystemInfo | null;
  currentUser: UserDto | null;
}

export const initialState: State = {
  isAuthenticated: false,
  publicSystemInfo: null,
  currentUser: null,
};

export const jellyfinReducer = createReducer(
  initialState,
  on(JellyfinActions.loginSucceeded, (state) => ({
    ...state,
    isAuthenticated: true,
  })),
  on(JellyfinActions.getSystemInfoSucceeded, (state, { systemInfo }) => ({
    ...state,
    publicSystemInfo: systemInfo,
  })),
  on(JellyfinActions.getCurrentUserSucceeded, (state, { user }) => ({
    ...state,
    currentUser: user,
  }))
);
