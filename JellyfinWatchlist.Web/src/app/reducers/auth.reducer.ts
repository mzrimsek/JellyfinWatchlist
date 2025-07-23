import { createFeature, createReducer, on } from '@ngrx/store';

import { AuthActions } from '../actions/auth.actions';

export interface State {
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: State = {
  isAuthenticated: false,
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
    (state): State => ({
      ...state,
      isAuthenticated: true,
      loading: false,
    }),
  ),
  on(
    AuthActions.loginFailed,
    (state): State => ({
      ...state,
      isAuthenticated: false,
      loading: false,
    }),
  ),
  on(
    AuthActions.logout,
    (state): State => ({
      ...state,
      isAuthenticated: false,
    }),
  ),
);

const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const { name, reducer, selectAuthState, selectIsAuthenticated, selectLoading } = authFeature;
