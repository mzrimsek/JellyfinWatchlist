import * as CurrentUserActions from '../actions/current-user.actions';

import { createFeature, createReducer, on } from '@ngrx/store';

import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

export interface State {
  currentUser: UserDto | null;
  loading: boolean;
}

const initialState: State = {
  currentUser: null,
  loading: false,
};

export const currentUserReducer = createReducer(
  initialState,
  on(CurrentUserActions.getCurrentUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(CurrentUserActions.getCurrentUserSucceeded, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
  })),
  on(CurrentUserActions.getCurrentUserFailed, (state) => ({
    ...state,
    currentUser: null,
    loading: false,
  }))
);

const currentUserFeature = createFeature({
  name: 'currentUser',
  reducer: currentUserReducer,
});

export const {
  name,
  reducer,
  selectCurrentUserState,
  selectCurrentUser,
  selectLoading,
} = currentUserFeature;
