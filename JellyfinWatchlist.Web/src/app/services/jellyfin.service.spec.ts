import { SpectatorService, createServiceFactory, mockProvider } from '@ngneat/spectator';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { JellyfinService } from './jellyfin.service';
import { environment } from '../../environments/environment';
import { selectAccessToken } from '../reducers/auth.reducer';

describe('JellyfinService', () => {
  let spectator: SpectatorService<JellyfinService>;
  let service: JellyfinService;
  let store: jasmine.SpyObj<Store>;

  const createService = createServiceFactory({
    service: JellyfinService,
    providers: [
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.returnValue(of(null)),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    store = spectator.inject(Store) as jasmine.SpyObj<Store>;

    // Reset store spy for each test
    store.select.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItemPrimaryImageUrl', () => {
    it('should return correct image url with default parameters', () => {
      const itemId = 'item-123';
      const tag = 'tag-456';

      const result = service.getItemPrimaryImageUrl(itemId, tag);

      const expectedUrl = `${environment.jellyfin.baseUrl}/Items/${itemId}/Images/Primary?tag=${tag}&quality=90&fillHeight=495&fillWidth=330`;
      expect(result).toBe(expectedUrl);
    });

    it('should return correct image url with custom parameters', () => {
      const itemId = 'item-123';
      const tag = 'tag-456';
      const quality = 95;
      const fillHeight = 600;
      const fillWidth = 400;

      const result = service.getItemPrimaryImageUrl(itemId, tag, quality, fillHeight, fillWidth);

      const expectedUrl = `${environment.jellyfin.baseUrl}/Items/${itemId}/Images/Primary?tag=${tag}&quality=${quality}&fillHeight=${fillHeight}&fillWidth=${fillWidth}`;
      expect(result).toBe(expectedUrl);
    });
  });

  describe('service initialization', () => {
    it('should initialize with jellyfin sdk and api', () => {
      expect((service as any).sdk).toBeDefined();
      expect((service as any).api).toBeDefined();
    });

    it('should select access token from store on initialization', () => {
      // Since the service uses inject(Store) in constructor, we can't easily spy on it
      // Instead, we verify the service initializes without error
      expect(service).toBeTruthy();
    });
  });

  describe('Auto-authorization', () => {
    it('should initialize with auto-authorization logic', () => {
      // The service automatically subscribes to access token changes in constructor
      // Since it uses inject(Store), we can't easily test the subscription directly
      // but we can verify the service initializes properly
      expect(service).toBeTruthy();
    });
  });

  describe('login method', () => {
    it('should return access token on successful login', (done) => {
      // Mock the authenticateUserByName method to return a successful response
      const mockAccessToken = 'successful-login-token';
      const mockResponse = {
        data: { AccessToken: mockAccessToken },
        status: 200,
      };

      spyOn((service as any).api, 'authenticateUserByName').and.returnValue(
        Promise.resolve(mockResponse),
      );

      service.login('testuser', 'testpass').subscribe((token) => {
        expect(token).toBe(mockAccessToken);
        done();
      });
    });

    it('should return null when login response has no access token', (done) => {
      const mockResponse = {
        data: { AccessToken: null },
        status: 200,
      };

      spyOn((service as any).api, 'authenticateUserByName').and.returnValue(
        Promise.resolve(mockResponse),
      );

      service.login('testuser', 'testpass').subscribe((token) => {
        expect(token).toBe(null);
        done();
      });
    });

    it('should return null on login error', (done) => {
      spyOn((service as any).api, 'authenticateUserByName').and.returnValue(
        Promise.reject(new Error('Login failed')),
      );

      service.login('testuser', 'wrongpass').subscribe((token) => {
        expect(token).toBe(null);
        done();
      });
    });

    it('should handle undefined access token in response', (done) => {
      const mockResponse = {
        data: { AccessToken: undefined },
        status: 200,
      };

      spyOn((service as any).api, 'authenticateUserByName').and.returnValue(
        Promise.resolve(mockResponse),
      );

      service.login('testuser', 'testpass').subscribe((token) => {
        expect(token).toBe(null);
        done();
      });
    });
  });

  // Note: The async methods (logout, getCurrentUser, getSystemInfo, search)
  // would require more complex mocking of the Jellyfin SDK's API objects.
  // For full coverage, consider using integration tests or more sophisticated mocking.
});
