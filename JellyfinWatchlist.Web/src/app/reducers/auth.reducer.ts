import { createFeature, createReducer, on } from '@ngrx/store';

import { AuthActions } from '../actions/auth.actions';

export interface State {
  accessToken: string | null;
  loading: boolean;
}

const initialState: State = {
  accessToken: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    AuthActions.loginSucceeded,
    (state, action): State => ({
      ...state,
      loading: false,
      accessToken: action.accessToken,
    }),
  ),
  on(
    AuthActions.loginFailed,
    (state): State => ({
      ...state,
      loading: false,
      accessToken: null,
    }),
  ),
  on(
    AuthActions.logout,
    (state): State => ({
      ...state,
      accessToken: null,
    }),
  ),
);

const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const { name, reducer, selectAuthState, selectAccessToken, selectLoading } = authFeature;
