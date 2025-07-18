import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { JellyfinService } from './jellyfin.service';

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
});
