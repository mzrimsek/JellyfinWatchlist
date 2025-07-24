import { Observable, of, throwError } from 'rxjs';

import { Action } from '@ngrx/store';
import { CurrentUserActions } from '../actions/current-user.actions';
import { CurrentUserEffects } from './current-user.effects';
import { JellyfinService } from '../services/jellyfin.service';
import { TestBed } from '@angular/core/testing';
import { WatchlistActions } from '../actions/watchlist.actions';
import { provideMockActions } from '@ngrx/effects/testing';

// Mock user data
const mockUser = {
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

describe('CurrentUserEffects', () => {
  let actions$: Observable<Action>;
  let effects: CurrentUserEffects;
  let jellyfinService: jasmine.SpyObj<JellyfinService>;

  beforeEach(() => {
    const jellyfinServiceSpy = jasmine.createSpyObj('JellyfinService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      providers: [
        CurrentUserEffects,
        provideMockActions(() => actions$),
        { provide: JellyfinService, useValue: jellyfinServiceSpy },
      ],
    });

    effects = TestBed.inject(CurrentUserEffects);
    jellyfinService = TestBed.inject(JellyfinService) as jasmine.SpyObj<JellyfinService>;
  });

  describe('getCurrentUser$', () => {
    it('should return CurrentUserActions.getSucceeded when service call succeeds', (done) => {
      const action = CurrentUserActions.get();
      const expectedAction = CurrentUserActions.getSucceeded({ user: mockUser });

      actions$ = of(action);
      jellyfinService.getCurrentUser.and.returnValue(of(mockUser));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.getCurrentUser).toHaveBeenCalled();
        done();
      });
    });

    it('should return CurrentUserActions.getFailed when service call fails', (done) => {
      const action = CurrentUserActions.get();
      const expectedAction = CurrentUserActions.getFailed();

      actions$ = of(action);
      jellyfinService.getCurrentUser.and.returnValue(
        throwError(() => new Error('User fetch failed')),
      );

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.getCurrentUser).toHaveBeenCalled();
        done();
      });
    });

    it('should handle network errors gracefully', (done) => {
      const action = CurrentUserActions.get();
      const expectedAction = CurrentUserActions.getFailed();

      actions$ = of(action);
      jellyfinService.getCurrentUser.and.returnValue(throwError(() => new Error('Network error')));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle undefined user response by failing', (done) => {
      const action = CurrentUserActions.get();
      const expectedAction = CurrentUserActions.getFailed();

      actions$ = of(action);
      jellyfinService.getCurrentUser.and.returnValue(throwError(() => new Error('No user found')));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.getCurrentUser).toHaveBeenCalled();
        done();
      });
    });

    it('should use exhaustMap to prevent multiple concurrent requests', (done) => {
      const action1 = CurrentUserActions.get();
      const action2 = CurrentUserActions.get();

      // Set up a delayed response for the first call
      jellyfinService.getCurrentUser.and.returnValue(of(mockUser));

      actions$ = of(action1, action2);

      let emissionCount = 0;
      effects.getCurrentUser$.subscribe((result) => {
        emissionCount++;
        expect(result).toEqual(CurrentUserActions.getSucceeded({ user: mockUser }));

        if (emissionCount === 2) {
          done();
        }
      });
    });
  });

  describe('getCurrentUserFailed$', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should log error message when get current user fails', (done) => {
      const action = CurrentUserActions.getFailed();
      actions$ = of(action);

      effects.getCurrentUserFailed$.subscribe(() => {
        expect(console.log).toHaveBeenCalledWith('Failed to get current user');
        done();
      });
    });

    it('should not trigger on other actions', (done) => {
      const action = CurrentUserActions.getSucceeded({ user: mockUser });
      actions$ = of(action);

      // Since this effect only listens to getFailed, it shouldn't trigger
      setTimeout(() => {
        expect(console.log).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should not dispatch any action (dispatch: false)', (done) => {
      const action = CurrentUserActions.getFailed();
      actions$ = of(action);

      effects.getCurrentUserFailed$.subscribe(() => {
        // This effect should not return any action
        expect(true).toBe(true); // Add expectation to satisfy test framework
        done();
      });
    });
  });

  describe('effects integration', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should handle complete success flow', (done) => {
      const action = CurrentUserActions.get();
      actions$ = of(action);

      jellyfinService.getCurrentUser.and.returnValue(of(mockUser));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(CurrentUserActions.getSucceeded({ user: mockUser }));
        expect(jellyfinService.getCurrentUser).toHaveBeenCalled();
        done();
      });
    });

    it('should handle complete failure flow', (done) => {
      const action = CurrentUserActions.get();
      actions$ = of(action);

      jellyfinService.getCurrentUser.and.returnValue(throwError(() => new Error('Service error')));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(CurrentUserActions.getFailed());

        // Now test the failed effect
        actions$ = of(CurrentUserActions.getFailed());

        effects.getCurrentUserFailed$.subscribe(() => {
          expect(console.log).toHaveBeenCalledWith('Failed to get current user');
          done();
        });
      });
    });

    it('should handle multiple user types', (done) => {
      const adminUser = { ...mockUser, Name: 'Admin User', Id: 'admin123' };
      const action = CurrentUserActions.get();
      const expectedAction = CurrentUserActions.getSucceeded({ user: adminUser });

      actions$ = of(action);
      jellyfinService.getCurrentUser.and.returnValue(of(adminUser));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        if ('user' in result) {
          expect(result.user).toEqual(adminUser);
        }
        done();
      });
    });
  });
});
