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
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.loginSucceeded, (state) => ({
    ...state,
    isAuthenticated: true,
    loading: false,
  })),
  on(AuthActions.loginFailed, (state) => ({
    ...state,
    isAuthenticated: false,
    loading: false,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    isAuthenticated: false,
  })),
);

const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const { name, reducer, selectAuthState, selectIsAuthenticated, selectLoading } = authFeature;
