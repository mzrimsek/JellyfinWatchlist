/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, currentUserReducer } from './current-user.reducer';
import { CurrentUserActions } from '../actions/current-user.actions';
import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

describe('CurrentUserReducer', () => {
  const initialState: State = {
    user: null,
    loading: false,
  };

  const mockUser: UserDto = {
    Id: 'user123',
    Name: 'John Doe',
    ServerId: 'server456',
    HasPassword: true,
    HasConfiguredPassword: true,
    HasConfiguredEasyPassword: false,
    EnableAutoLogin: false,
    LastLoginDate: '2024-01-01T00:00:00.000Z',
    LastActivityDate: '2024-01-01T00:00:00.000Z',
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = currentUserReducer(undefined, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('get action', () => {
    it('should set loading to true and maintain user state', () => {
      const action = CurrentUserActions.get();
      const result = currentUserReducer(initialState, action);

      expect(result).toEqual({
        user: null,
        loading: true,
      });
    });

    it('should set loading to true from populated state', () => {
      const populatedState: State = {
        user: mockUser,
        loading: false,
      };
      const action = CurrentUserActions.get();
      const result = currentUserReducer(populatedState, action);

      expect(result).toEqual({
        user: mockUser,
        loading: true,
      });
    });

    it('should handle get action when already loading', () => {
      const loadingState: State = {
        user: mockUser,
        loading: true,
      };
      const action = CurrentUserActions.get();
      const result = currentUserReducer(loadingState, action);

      expect(result).toEqual({
        user: mockUser,
        loading: true,
      });
    });
  });

  describe('getSucceeded action', () => {
    it('should set user and set loading to false', () => {
      const loadingState: State = {
        user: null,
        loading: true,
      };
      const action = CurrentUserActions.getSucceeded({ user: mockUser });
      const result = currentUserReducer(loadingState, action);

      expect(result).toEqual({
        user: mockUser,
        loading: false,
      });
    });

    it('should update user from different user', () => {
      const differentUser: UserDto = {
        Id: 'user456',
        Name: 'Jane Smith',
        ServerId: 'server789',
        HasPassword: false,
        HasConfiguredPassword: false,
        HasConfiguredEasyPassword: true,
        EnableAutoLogin: true,
        LastLoginDate: '2024-02-01T00:00:00.000Z',
        LastActivityDate: '2024-02-01T00:00:00.000Z',
      };
      const existingUserState: State = {
        user: mockUser,
        loading: true,
      };
      const action = CurrentUserActions.getSucceeded({ user: differentUser });
      const result = currentUserReducer(existingUserState, action);

      expect(result).toEqual({
        user: differentUser,
        loading: false,
      });
    });

    it('should handle getSucceeded when not loading', () => {
      const notLoadingState: State = {
        user: null,
        loading: false,
      };
      const action = CurrentUserActions.getSucceeded({ user: mockUser });
      const result = currentUserReducer(notLoadingState, action);

      expect(result).toEqual({
        user: mockUser,
        loading: false,
      });
    });

    it('should handle replacing existing user', () => {
      const existingState: State = {
        user: mockUser,
        loading: false,
      };
      const updatedUser: UserDto = {
        ...mockUser,
        Name: 'John Updated',
        LastActivityDate: '2024-03-01T00:00:00.000Z',
      };
      const action = CurrentUserActions.getSucceeded({ user: updatedUser });
      const result = currentUserReducer(existingState, action);

      expect(result).toEqual({
        user: updatedUser,
        loading: false,
      });
      expect(result.user?.Name).toBe('John Updated');
    });
  });

  describe('getFailed action', () => {
    it('should clear user and set loading to false', () => {
      const loadingState: State = {
        user: mockUser,
        loading: true,
      };
      const action = CurrentUserActions.getFailed();
      const result = currentUserReducer(loadingState, action);

      expect(result).toEqual({
        user: null,
        loading: false,
      });
    });

    it('should clear user when not loading', () => {
      const notLoadingState: State = {
        user: mockUser,
        loading: false,
      };
      const action = CurrentUserActions.getFailed();
      const result = currentUserReducer(notLoadingState, action);

      expect(result).toEqual({
        user: null,
        loading: false,
      });
    });

    it('should handle getFailed from initial state', () => {
      const action = CurrentUserActions.getFailed();
      const result = currentUserReducer(initialState, action);

      expect(result).toEqual({
        user: null,
        loading: false,
      });
    });
  });

  describe('clear action', () => {
    it('should clear user and maintain loading state', () => {
      const populatedState: State = {
        user: mockUser,
        loading: false,
      };
      const action = CurrentUserActions.clear();
      const result = currentUserReducer(populatedState, action);

      expect(result).toEqual({
        user: null,
        loading: false,
      });
    });

    it('should clear user while loading', () => {
      const loadingState: State = {
        user: mockUser,
        loading: true,
      };
      const action = CurrentUserActions.clear();
      const result = currentUserReducer(loadingState, action);

      expect(result).toEqual({
        user: null,
        loading: true,
      });
    });

    it('should handle clear from initial state', () => {
      const action = CurrentUserActions.clear();
      const result = currentUserReducer(initialState, action);

      expect(result).toEqual({
        user: null,
        loading: false,
      });
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on get', () => {
      const originalState = { ...initialState };
      const action = CurrentUserActions.get();
      const result = currentUserReducer(initialState, action);

      expect(initialState).toEqual(originalState);
      expect(result).not.toBe(initialState);
    });

    it('should not mutate original state on getSucceeded', () => {
      const loadingState: State = {
        user: null,
        loading: true,
      };
      const originalState = { ...loadingState };
      const action = CurrentUserActions.getSucceeded({ user: mockUser });
      const result = currentUserReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
      expect(result.user).toBe(mockUser); // Should reference the same user object
    });

    it('should not mutate original state on getFailed', () => {
      const loadingState: State = {
        user: mockUser,
        loading: true,
      };
      const originalState = { ...loadingState };
      const action = CurrentUserActions.getFailed();
      const result = currentUserReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
    });

    it('should not mutate original state on clear', () => {
      const populatedState: State = {
        user: mockUser,
        loading: false,
      };
      const originalState = { ...populatedState };
      const action = CurrentUserActions.clear();
      const result = currentUserReducer(populatedState, action);

      expect(populatedState).toEqual(originalState);
      expect(result).not.toBe(populatedState);
    });
  });
});
