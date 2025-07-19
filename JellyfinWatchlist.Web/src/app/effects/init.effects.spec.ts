import { Observable, of } from 'rxjs';

import { Action } from '@ngrx/store';
import { InitEffects } from './init.effects';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { SystemInfoActions } from '../actions/system-info.actions';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

describe('InitEffects', () => {
  let actions$: Observable<Action>;
  let effects: InitEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(InitEffects);
  });

  describe('getSystemInfo$', () => {
    it('should dispatch SystemInfoActions.get when ROOT_EFFECTS_INIT is triggered', (done) => {
      const initAction = { type: ROOT_EFFECTS_INIT };
      const expectedAction = SystemInfoActions.get();

      actions$ = of(initAction);

      effects.getSystemInfo$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(result.type).toBe('[System Info] Get');
        done();
      });
    });

    it('should only respond to ROOT_EFFECTS_INIT action', (done) => {
      const otherAction = { type: 'OTHER_ACTION' };

      actions$ = of(otherAction);

      // Since the effect only listens to ROOT_EFFECTS_INIT, no action should be emitted
      setTimeout(() => {
        // Test passes if we reach this point without the effect emitting
        expect(true).toBe(true); // Add expectation to satisfy test framework
        done();
      }, 100);

      effects.getSystemInfo$.subscribe(() => {
        // This should not be called for other actions
        fail('Effect should not emit for non-ROOT_EFFECTS_INIT actions');
      });
    });

    it('should emit exactly one action on init', (done) => {
      const initAction = { type: ROOT_EFFECTS_INIT };
      let emissionCount = 0;

      actions$ = of(initAction);

      effects.getSystemInfo$.subscribe((result) => {
        emissionCount++;
        expect(result).toEqual(SystemInfoActions.get());

        // Ensure only one emission
        setTimeout(() => {
          expect(emissionCount).toBe(1);
          done();
        }, 50);
      });
    });

    it('should handle multiple ROOT_EFFECTS_INIT actions', (done) => {
      const initAction1 = { type: ROOT_EFFECTS_INIT };
      const initAction2 = { type: ROOT_EFFECTS_INIT };
      let emissionCount = 0;

      actions$ = of(initAction1, initAction2);

      effects.getSystemInfo$.subscribe((result) => {
        emissionCount++;
        expect(result).toEqual(SystemInfoActions.get());

        if (emissionCount === 2) {
          done();
        }
      });
    });

    it('should not modify the SystemInfoActions.get action', (done) => {
      const initAction = { type: ROOT_EFFECTS_INIT };
      const expectedAction = SystemInfoActions.get();

      actions$ = of(initAction);

      effects.getSystemInfo$.subscribe((result) => {
        // Verify the action is identical to what SystemInfoActions.get() returns
        expect(result).toEqual(expectedAction);
        expect(result.type).toBe(expectedAction.type);
        expect(Object.keys(result)).toEqual(Object.keys(expectedAction));
        done();
      });
    });
  });

  describe('effect behavior', () => {
    it('should be a dispatching effect (default behavior)', (done) => {
      const initAction = { type: ROOT_EFFECTS_INIT };

      actions$ = of(initAction);

      effects.getSystemInfo$.subscribe((result) => {
        // Since this is a dispatching effect, it should return an action
        expect(result).toBeDefined();
        expect(result.type).toBeDefined();
        done();
      });
    });

    it('should use map operator to transform ROOT_EFFECTS_INIT to SystemInfoActions.get', (done) => {
      const initAction = { type: ROOT_EFFECTS_INIT };

      actions$ = of(initAction);

      effects.getSystemInfo$.subscribe((result) => {
        // Verify transformation
        expect(result.type).toBe('[System Info] Get');
        expect(result.type).not.toBe(ROOT_EFFECTS_INIT);
        done();
      });
    });

    it('should work with asynchronous action streams', (done) => {
      const initAction = { type: ROOT_EFFECTS_INIT };

      // Simulate async action stream
      actions$ = new Observable((observer) => {
        setTimeout(() => {
          observer.next(initAction);
          observer.complete();
        }, 10);
      });

      effects.getSystemInfo$.subscribe((result) => {
        expect(result).toEqual(SystemInfoActions.get());
        done();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should properly initialize system info on app startup', (done) => {
      // Simulate app startup sequence
      const startupActions = [
        { type: ROOT_EFFECTS_INIT },
        { type: 'SOME_OTHER_STARTUP_ACTION' },
        { type: 'ANOTHER_ACTION' },
      ];

      actions$ = of(...startupActions);

      let initEffectTriggered = false;

      effects.getSystemInfo$.subscribe((result) => {
        // Should only trigger once for ROOT_EFFECTS_INIT
        expect(initEffectTriggered).toBe(false);
        initEffectTriggered = true;
        expect(result).toEqual(SystemInfoActions.get());

        setTimeout(() => {
          // Confirm it was only triggered once
          done();
        }, 50);
      });
    });

    it('should handle effect reinitialization', (done) => {
      const firstInit = { type: ROOT_EFFECTS_INIT };
      const secondInit = { type: ROOT_EFFECTS_INIT };

      let callCount = 0;

      actions$ = of(firstInit);

      effects.getSystemInfo$.subscribe((result) => {
        callCount++;
        expect(result).toEqual(SystemInfoActions.get());

        if (callCount === 1) {
          // Test second initialization
          actions$ = of(secondInit);

          effects.getSystemInfo$.subscribe((secondResult) => {
            callCount++;
            expect(secondResult).toEqual(SystemInfoActions.get());
            expect(callCount).toBe(2);
            done();
          });
        }
      });
    });

    it('should maintain effect behavior across different test scenarios', (done) => {
      const scenarios = [
        { type: ROOT_EFFECTS_INIT },
        { type: ROOT_EFFECTS_INIT },
        { type: ROOT_EFFECTS_INIT },
      ];

      let scenarioIndex = 0;

      const testScenario = () => {
        if (scenarioIndex >= scenarios.length) {
          done();
          return;
        }

        actions$ = of(scenarios[scenarioIndex]);

        effects.getSystemInfo$.subscribe((result) => {
          expect(result).toEqual(SystemInfoActions.get());
          scenarioIndex++;
          testScenario();
        });
      };

      testScenario();
    });
  });
});
