import * as loginActions from '../actions/auth.actions';

import { createFeature, createReducer, on } from '@ngrx/store';

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
  on(loginActions.login, (state) => ({
    ...state,
    loading: true,
  })),
  on(loginActions.loginSucceeded, (state) => ({
    ...state,
    isAuthenticated: true,
    loading: false,
  })),
  on(loginActions.loginFailed, (state) => ({
    ...state,
    isAuthenticated: false,
    loading: false,
  })),
  on(loginActions.logout, (state) => ({
    ...state,
    isAuthenticated: false,
  }))
);

const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const {
  name,
  reducer,
  selectAuthState,
  selectIsAuthenticated,
  selectLoading,
} = authFeature;
