import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ username: string; password: string }>(),
    LoginSucceeded: emptyProps(),
    LoginFailed: emptyProps(),
    Logout: emptyProps(),
  },
});
