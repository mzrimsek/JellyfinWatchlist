import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';
import { configInitializerFactory, CONFIG_INITIALIZER_PROVIDER } from './config-initializer';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FactoryProvider } from '@angular/core';

describe('Config Initializer', () => {
  describe('configInitializerFactory', () => {
    it('should return a function that calls loadConfig', async () => {
      const loadConfigSpy = jasmine.createSpy('loadConfig').and.returnValue(Promise.resolve());
      const mockConfigService: Pick<ConfigService, 'loadConfig'> = {
        loadConfig: loadConfigSpy,
      };

      const initializerFn = configInitializerFactory(mockConfigService as ConfigService);

      expect(typeof initializerFn).toBe('function');

      await initializerFn();

      expect(loadConfigSpy).toHaveBeenCalledOnceWith();
    });
  });

  describe('CONFIG_INITIALIZER_PROVIDER', () => {
    it('should be properly configured', () => {
      const provider = CONFIG_INITIALIZER_PROVIDER as FactoryProvider;

      expect(provider.useFactory).toBe(configInitializerFactory);
      expect(provider.deps).toEqual([ConfigService]);
      expect(provider.multi).toBe(true);
    });

    it('should be usable in Angular DI system', () => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [CONFIG_INITIALIZER_PROVIDER, ConfigService],
      });

      expect(() => TestBed.inject(ConfigService)).not.toThrow();
    });
  });
});
