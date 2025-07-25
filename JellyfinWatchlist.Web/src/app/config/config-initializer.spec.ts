import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';
import { initializeConfig, provideConfigInitializer } from './config-initializer';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { runInInjectionContext, inject, Injector } from '@angular/core';

describe('Config Initializer', () => {
  describe('initializeConfig', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ConfigService, provideHttpClient(), provideHttpClientTesting()],
      });
    });

    it('should call loadConfig on ConfigService', async () => {
      const injector = TestBed.inject(Injector);

      await runInInjectionContext(injector, async () => {
        const configService = inject(ConfigService);
        const loadConfigSpy = spyOn(configService, 'loadConfig').and.returnValue(Promise.resolve());

        await initializeConfig();

        expect(loadConfigSpy).toHaveBeenCalledOnceWith();
      });
    });
  });

  describe('provideConfigInitializer', () => {
    it('should return a provider', () => {
      const provider = provideConfigInitializer();

      // provideAppInitializer returns a provider, we just check it's defined
      expect(provider).toBeDefined();
    });

    it('should be usable in Angular DI system', () => {
      TestBed.configureTestingModule({
        providers: [
          provideConfigInitializer(),
          ConfigService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      });

      expect(() => TestBed.inject(ConfigService)).not.toThrow();
    });
  });
});
