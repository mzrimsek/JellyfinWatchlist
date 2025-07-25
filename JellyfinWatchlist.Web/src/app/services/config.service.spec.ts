import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ConfigService } from './config.service';
import { AppConfig } from '../config/app-config.interface';

describe('ConfigService', () => {
  let spectator: SpectatorService<ConfigService>;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
    jellyfin: {
      baseUrl: 'https://test-jellyfin.example.com',
    },
    watchlist: {
      baseUrl: 'https://test-api.example.com',
    },
    production: false,
  };

  const createService = createServiceFactory({
    service: ConfigService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should load configuration from API successfully', async () => {
    const loadPromise = spectator.service.loadConfig();

    const req = httpMock.expectOne('/api/config');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);

    await loadPromise;

    expect(spectator.service.config).toEqual(mockConfig);
    expect(spectator.service.isLoaded).toBe(true);
    expect(spectator.service.isLoading).toBe(false);
    expect(spectator.service.loadError).toBeUndefined();
  });

  it('should fallback to environment config when API fails', async () => {
    const loadPromise = spectator.service.loadConfig();

    const req = httpMock.expectOne('/api/config');
    req.error(new ProgressEvent('Network error'));

    await loadPromise;

    expect(spectator.service.isLoaded).toBe(true);
    expect(spectator.service.isLoading).toBe(false);
    expect(spectator.service.loadError).toBe('Failed to load runtime config, using fallback');
  });

  it('should provide typed accessors for configuration values', async () => {
    const loadPromise = spectator.service.loadConfig();

    const req = httpMock.expectOne('/api/config');
    req.flush(mockConfig);

    await loadPromise;

    expect(spectator.service.jellyfinBaseUrl).toBe('https://test-jellyfin.example.com');
    expect(spectator.service.watchlistBaseUrl).toBe('https://test-api.example.com');
    expect(spectator.service.isProduction).toBe(false);
  });

  it('should handle empty configuration gracefully', () => {
    expect(spectator.service.jellyfinBaseUrl).toBe('');
    expect(spectator.service.watchlistBaseUrl).toBe('');
    expect(spectator.service.isProduction).toBe(false);
  });

  it('should emit configuration changes via observables', async () => {
    let emittedConfig: AppConfig | undefined;
    spectator.service.config$.subscribe((config: AppConfig) => (emittedConfig = config));

    const loadPromise = spectator.service.loadConfig();

    const req = httpMock.expectOne('/api/config');
    req.flush(mockConfig);

    await loadPromise;

    expect(emittedConfig).toEqual(mockConfig);
  });
});
