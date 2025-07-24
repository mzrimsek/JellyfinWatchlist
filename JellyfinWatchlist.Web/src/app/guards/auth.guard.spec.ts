import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  ParamMap,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock route and state objects
    mockRoute = {
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: {} as ParamMap,
      queryParamMap: {} as ParamMap,
      title: undefined,
    } as ActivatedRouteSnapshot;

    mockState = {
      url: '/protected-route',
      root: mockRoute,
    } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  describe('authentication checks', () => {
    it('should allow access when user has valid access token', (done) => {
      store.select.and.returnValue(of('valid-access-token'));

      const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should deny access when user has no access token', (done) => {
      store.select.and.returnValue(of(null));

      const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should redirect to login page when access token is null', (done) => {
      store.select.and.returnValue(of(null));

      const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

      result.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(router.navigate).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should not redirect when user has valid access token', (done) => {
      store.select.and.returnValue(of('valid-token'));

      const result = executeGuard(mockRoute, mockState) as Observable<boolean>;

      result.subscribe(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('store integration', () => {
    it('should select access token from store', () => {
      store.select.and.returnValue(of('test-token'));

      executeGuard(mockRoute, mockState);

      expect(store.select).toHaveBeenCalled();
    });

    it('should handle multiple authentication checks', (done) => {
      store.select.and.returnValue(of(null));

      const result1 = executeGuard(mockRoute, mockState) as Observable<boolean>;

      result1.subscribe((canActivate1: boolean) => {
        expect(canActivate1).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);

        // Reset for second call
        router.navigate.calls.reset();
        store.select.and.returnValue(of('valid-token'));

        const result2 = executeGuard(mockRoute, mockState) as Observable<boolean>;

        result2.subscribe((canActivate2: boolean) => {
          expect(canActivate2).toBe(true);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('route parameters', () => {
    it('should work with different route snapshots', (done) => {
      store.select.and.returnValue(of('access-token'));

      const customRoute = Object.assign({}, mockRoute, {
        params: { id: '123' },
        queryParams: { tab: 'details' },
      });

      const result = executeGuard(customRoute, mockState) as Observable<boolean>;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(true);
        done();
      });
    });

    it('should work with different router states', (done) => {
      store.select.and.returnValue(of('token-123'));

      const customState = {
        url: '/different/protected/route',
        root: mockRoute,
      } as RouterStateSnapshot;

      const result = executeGuard(mockRoute, customState) as Observable<boolean>;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(true);
        done();
      });
    });
  });

  describe('guard behavior', () => {
    it('should return observable that emits boolean based on access token', (done) => {
      store.select.and.returnValue(of('valid-access-token'));

      const result = executeGuard(mockRoute, mockState);

      expect(result).toBeDefined();

      (result as Observable<boolean>).subscribe((value: boolean) => {
        expect(typeof value).toBe('boolean');
        expect(value).toBe(true);
        done();
      });
    });

    it('should handle null access token correctly for protected routes', (done) => {
      store.select.and.returnValue(of(null));

      const protectedState = {
        url: '/search',
        root: mockRoute,
      } as RouterStateSnapshot;

      const result = executeGuard(mockRoute, protectedState) as Observable<boolean>;

      result.subscribe((canActivate: boolean) => {
        expect(canActivate).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should correctly map access token to boolean authentication state', (done) => {
      // Test with valid token
      store.select.and.returnValue(of('jwt-token-123'));

      const result1 = executeGuard(mockRoute, mockState) as Observable<boolean>;

      result1.subscribe((canActivate1: boolean) => {
        expect(canActivate1).toBe(true);

        // Test with null token
        store.select.and.returnValue(of(null));
        const result2 = executeGuard(mockRoute, mockState) as Observable<boolean>;

        result2.subscribe((canActivate2: boolean) => {
          expect(canActivate2).toBe(false);
          done();
        });
      });
    });
  });
});
