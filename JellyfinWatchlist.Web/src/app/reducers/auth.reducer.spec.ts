import { authReducer, State } from './auth.reducer';
import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

describe('AuthReducer', () => {
  const initialState: State = {
    accessToken: null,
    loading: false,
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as Action;
      const result = authReducer(undefined, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('login action', () => {
    it('should set loading to true and maintain access token state', () => {
      const action = AuthActions.login({ username: 'testuser', password: 'testpass' });
      const result = authReducer(initialState, action);

      expect(result).toEqual({
        accessToken: null,
        loading: true,
      });
    });

    it('should set loading to true from authenticated state', () => {
      const authenticatedState: State = {
        accessToken: 'existing-token',
        loading: false,
      };
      const action = AuthActions.login({ username: 'testuser', password: 'testpass' });
      const result = authReducer(authenticatedState, action);

      expect(result).toEqual({
        accessToken: 'existing-token',
        loading: true,
      });
    });
  });

  describe('loginSucceeded action', () => {
    it('should set access token and loading to false', () => {
      const loadingState: State = {
        accessToken: null,
        loading: true,
      };
      const action = AuthActions.loginSucceeded({ accessToken: 'new-access-token' });
      const result = authReducer(loadingState, action);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        loading: false,
      });
    });

    it('should work from initial state', () => {
      const action = AuthActions.loginSucceeded({ accessToken: 'test-token' });
      const result = authReducer(initialState, action);

      expect(result).toEqual({
        accessToken: 'test-token',
        loading: false,
      });
    });
  });

  describe('loginFailed action', () => {
    it('should clear access token and set loading to false', () => {
      const loadingState: State = {
        accessToken: null,
        loading: true,
      };
      const action = AuthActions.loginFailed();
      const result = authReducer(loadingState, action);

      expect(result).toEqual({
        accessToken: null,
        loading: false,
      });
    });

    it('should clear access token if previously authenticated', () => {
      const authenticatedLoadingState: State = {
        accessToken: 'existing-token',
        loading: true,
      };
      const action = AuthActions.loginFailed();
      const result = authReducer(authenticatedLoadingState, action);

      expect(result).toEqual({
        accessToken: null,
        loading: false,
      });
    });
  });

  describe('logout action', () => {
    it('should clear access token', () => {
      const authenticatedState: State = {
        accessToken: 'existing-token',
        loading: false,
      };
      const action = AuthActions.logout();
      const result = authReducer(authenticatedState, action);

      expect(result).toEqual({
        accessToken: null,
        loading: false, // loading state is preserved as per the current implementation
      });
    });

    it('should clear access token but preserve loading state', () => {
      const loadingState: State = {
        accessToken: 'existing-token',
        loading: true,
      };
      const action = AuthActions.logout();
      const result = authReducer(loadingState, action);

      expect(result).toEqual({
        accessToken: null,
        loading: true, // loading state is preserved as per the current implementation
      });
    });

    it('should work from initial state', () => {
      const action = AuthActions.logout();
      const result = authReducer(initialState, action);

      expect(result).toEqual({
        accessToken: null,
        loading: false,
      });
    });
  });

  describe('state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState: State = {
        accessToken: 'original-token',
        loading: false,
      };
      const action = AuthActions.login({ username: 'test', password: 'test' });
      const result = authReducer(originalState, action);

      expect(result).not.toBe(originalState);
      expect(originalState.accessToken).toBe('original-token');
      expect(originalState.loading).toBe(false);
    });
  });
});
