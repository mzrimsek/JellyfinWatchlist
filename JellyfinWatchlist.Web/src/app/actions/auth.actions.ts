import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);
export const loginSucceeded = createAction('[Auth] Login Succeeded');
export const loginFailed = createAction('[Auth] Login Failed');

export const logout = createAction('[Auth] Logout');
