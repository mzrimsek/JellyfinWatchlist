import { createFeature, createReducer, on } from '@ngrx/store';

import { CurrentUserActions } from '../actions/current-user.actions';
import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

export interface State {
  user: UserDto | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  loading: false,
};

export const currentUserReducer = createReducer(
  initialState,
  on(CurrentUserActions.get, (state) => ({
    ...state,
    loading: true,
  })),
  on(CurrentUserActions.getSucceeded, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(CurrentUserActions.getFailed, (state) => ({
    ...state,
    user: null,
    loading: false,
  })),
  on(CurrentUserActions.clear, (state) => ({
    ...state,
    user: null,
  })),
);

const currentUserFeature = createFeature({
  name: 'currentUser',
  reducer: currentUserReducer,
});

export const { name, reducer, selectCurrentUserState, selectUser, selectLoading } =
  currentUserFeature;
