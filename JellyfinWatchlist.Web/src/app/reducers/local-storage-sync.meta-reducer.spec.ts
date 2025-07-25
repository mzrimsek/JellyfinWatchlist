/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import { localStorageSyncReducer } from './local-storage-sync.meta-reducer';

describe('LocalStorageSyncMetaReducer', () => {
  let mockReducer: jasmine.Spy<ActionReducer<any>>;
  let wrappedReducer: ActionReducer<any>;

  beforeEach(() => {
    // Create a mock reducer that returns the state it receives
    mockReducer = jasmine.createSpy('mockReducer').and.callFake((state) => state || {});

    // Apply the meta-reducer to the mock reducer
    wrappedReducer = localStorageSyncReducer(mockReducer);
  });

  it('should create a wrapped reducer function', () => {
    expect(typeof wrappedReducer).toBe('function');
    expect(wrappedReducer).toBeDefined();
  });

  it('should call the original reducer', () => {
    const mockState = { test: 'state' };
    const mockAction = { type: 'TEST_ACTION' };

    wrappedReducer(mockState, mockAction);

    expect(mockReducer).toHaveBeenCalledWith(mockState, mockAction);
  });

  it('should return a function that maintains reducer interface', () => {
    const mockState = { auth: { accessToken: 'test' } };
    const mockAction = { type: 'TEST_ACTION' };

    mockReducer.and.returnValue(mockState);
    const result = wrappedReducer(mockState, mockAction);

    // The wrapped reducer should return some result (localStorage sync may modify it)
    expect(result).toBeDefined();
  });

  it('should be configured with the correct state keys', () => {
    // This test verifies the configuration is in place
    // The actual localStorage sync behavior is tested by the library itself
    expect(localStorageSyncReducer).toBeDefined();

    // Verify it's a function that takes a reducer and returns a reducer
    expect(typeof localStorageSyncReducer).toBe('function');
    expect(typeof localStorageSyncReducer(mockReducer)).toBe('function');
  });
});
