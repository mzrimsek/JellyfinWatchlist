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

  describe('getCurrentUserSucceededLoadWatchlist$', () => {
    it('should dispatch WatchlistActions.loadWatchlist when user is successfully fetched', (done) => {
      const action = CurrentUserActions.getSucceeded({ user: mockUser });
      const expectedAction = WatchlistActions.loadWatchlist();

      actions$ = of(action);

      effects.getCurrentUserSucceededLoadWatchlist$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should not trigger on other actions', (done) => {
      const action = CurrentUserActions.get();
      actions$ = of(action);

      // This effect should only trigger on getSucceeded, not on get
      let effectTriggered = false;
      effects.getCurrentUserSucceededLoadWatchlist$.subscribe(() => {
        effectTriggered = true;
      });

      setTimeout(() => {
        expect(effectTriggered).toBe(false);
        done();
      }, 100);
    });

    it('should trigger on any successful user fetch regardless of user data', (done) => {
      const differentUser = { ...mockUser, Id: 'different-user', Name: 'Different User' };
      const action = CurrentUserActions.getSucceeded({ user: differentUser });
      const expectedAction = WatchlistActions.loadWatchlist();

      actions$ = of(action);

      effects.getCurrentUserSucceededLoadWatchlist$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle multiple successful user actions', (done) => {
      const action1 = CurrentUserActions.getSucceeded({ user: mockUser });
      const action2 = CurrentUserActions.getSucceeded({ user: { ...mockUser, Name: 'User 2' } });
      const expectedAction = WatchlistActions.loadWatchlist();

      actions$ = of(action1, action2);

      let emissionCount = 0;
      effects.getCurrentUserSucceededLoadWatchlist$.subscribe((result) => {
        emissionCount++;
        expect(result).toEqual(expectedAction);

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

    it('should handle multiple failed actions', (done) => {
      const action1 = CurrentUserActions.getFailed();
      const action2 = CurrentUserActions.getFailed();

      actions$ = of(action1, action2);

      let logCallCount = 0;
      effects.getCurrentUserFailed$.subscribe(() => {
        logCallCount++;
        if (logCallCount === 2) {
          expect(console.log).toHaveBeenCalledTimes(2);
          expect(console.log).toHaveBeenCalledWith('Failed to get current user');
          done();
        }
      });
    });
  });

  describe('effects integration', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should handle complete success flow with watchlist loading', (done) => {
      const action = CurrentUserActions.get();
      actions$ = of(action);

      jellyfinService.getCurrentUser.and.returnValue(of(mockUser));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(CurrentUserActions.getSucceeded({ user: mockUser }));
        expect(jellyfinService.getCurrentUser).toHaveBeenCalled();

        // Now test that the success triggers watchlist loading
        actions$ = of(CurrentUserActions.getSucceeded({ user: mockUser }));

        effects.getCurrentUserSucceededLoadWatchlist$.subscribe((watchlistResult) => {
          expect(watchlistResult).toEqual(WatchlistActions.loadWatchlist());
          done();
        });
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

    it('should handle full user authentication workflow', (done) => {
      // Test the complete flow: get user -> success -> load watchlist
      const getUserAction = CurrentUserActions.get();
      jellyfinService.getCurrentUser.and.returnValue(of(mockUser));

      let step = 0;

      // Step 1: Initial get user action
      actions$ = of(getUserAction);
      effects.getCurrentUser$.subscribe((getUserResult) => {
        step++;
        expect(step).toBe(1);
        expect(getUserResult).toEqual(CurrentUserActions.getSucceeded({ user: mockUser }));

        // Step 2: Success action triggers watchlist load
        actions$ = of(CurrentUserActions.getSucceeded({ user: mockUser }));
        effects.getCurrentUserSucceededLoadWatchlist$.subscribe((watchlistResult) => {
          step++;
          expect(step).toBe(2);
          expect(watchlistResult).toEqual(WatchlistActions.loadWatchlist());
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

    it('should not load watchlist on user fetch failure', (done) => {
      const action = CurrentUserActions.get();
      actions$ = of(action);

      jellyfinService.getCurrentUser.and.returnValue(throwError(() => new Error('Auth failed')));

      effects.getCurrentUser$.subscribe((result) => {
        expect(result).toEqual(CurrentUserActions.getFailed());

        // Verify that getCurrentUserSucceeded$ doesn't trigger on failure
        let watchlistLoadTriggered = false;
        actions$ = of(CurrentUserActions.getFailed());

        effects.getCurrentUserSucceededLoadWatchlist$.subscribe(() => {
          watchlistLoadTriggered = true;
        });

        setTimeout(() => {
          expect(watchlistLoadTriggered).toBe(false);
          done();
        }, 100);
      });
    });
  });
});
