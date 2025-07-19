import { authReducer, State } from './auth.reducer';
import { AuthActions } from '../actions/auth.actions';

describe('AuthReducer', () => {
  const initialState: State = {
    isAuthenticated: false,
    loading: false,
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = authReducer(undefined, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('login action', () => {
    it('should set loading to true and maintain authentication state', () => {
      const action = AuthActions.login({ username: 'testuser', password: 'testpass' });
      const result = authReducer(initialState, action);

      expect(result).toEqual({
        isAuthenticated: false,
        loading: true,
      });
    });

    it('should set loading to true from authenticated state', () => {
      const authenticatedState: State = {
        isAuthenticated: true,
        loading: false,
      };
      const action = AuthActions.login({ username: 'testuser', password: 'testpass' });
      const result = authReducer(authenticatedState, action);

      expect(result).toEqual({
        isAuthenticated: true,
        loading: true,
      });
    });
  });

  describe('loginSucceeded action', () => {
    it('should set authenticated to true and loading to false', () => {
      const loadingState: State = {
        isAuthenticated: false,
        loading: true,
      };
      const action = AuthActions.loginSucceeded();
      const result = authReducer(loadingState, action);

      expect(result).toEqual({
        isAuthenticated: true,
        loading: false,
      });
    });

    it('should work from initial state', () => {
      const action = AuthActions.loginSucceeded();
      const result = authReducer(initialState, action);

      expect(result).toEqual({
        isAuthenticated: true,
        loading: false,
      });
    });
  });

  describe('loginFailed action', () => {
    it('should set authenticated to false and loading to false', () => {
      const loadingState: State = {
        isAuthenticated: false,
        loading: true,
      };
      const action = AuthActions.loginFailed();
      const result = authReducer(loadingState, action);

      expect(result).toEqual({
        isAuthenticated: false,
        loading: false,
      });
    });

    it('should reset authenticated state if previously authenticated', () => {
      const authenticatedLoadingState: State = {
        isAuthenticated: true,
        loading: true,
      };
      const action = AuthActions.loginFailed();
      const result = authReducer(authenticatedLoadingState, action);

      expect(result).toEqual({
        isAuthenticated: false,
        loading: false,
      });
    });
  });

  describe('logout action', () => {
    it('should reset authenticated state to false', () => {
      const authenticatedState: State = {
        isAuthenticated: true,
        loading: false,
      };
      const action = AuthActions.logout();
      const result = authReducer(authenticatedState, action);

      expect(result).toEqual({
        isAuthenticated: false,
        loading: false, // loading state is preserved as per the current implementation
      });
    });

    it('should reset authenticated state but preserve loading state', () => {
      const loadingState: State = {
        isAuthenticated: true,
        loading: true,
      };
      const action = AuthActions.logout();
      const result = authReducer(loadingState, action);

      expect(result).toEqual({
        isAuthenticated: false,
        loading: true, // loading state is preserved as per the current implementation
      });
    });

    it('should work from initial state', () => {
      const action = AuthActions.logout();
      const result = authReducer(initialState, action);

      expect(result).toEqual({
        isAuthenticated: false,
        loading: false,
      });
    });
  });
});
