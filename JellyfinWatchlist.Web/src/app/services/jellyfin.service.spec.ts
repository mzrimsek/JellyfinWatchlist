import { SpectatorService, createServiceFactory } from '@ngneat/spectator';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { JellyfinService } from './jellyfin.service';
import { environment } from '../../environments/environment';

describe('JellyfinService', () => {
  let spectator: SpectatorService<JellyfinService>;
  let service: JellyfinService;

  const createService = createServiceFactory({
    service: JellyfinService,
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
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
  });

  // Note: The async methods (login, logout, getCurrentUser, getSystemInfo, search)
  // would require more complex mocking of the Jellyfin SDK's API objects.
  // For full coverage, consider using integration tests or more sophisticated mocking.
});
