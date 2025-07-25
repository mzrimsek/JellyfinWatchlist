import { Test, TestingModule } from '@nestjs/testing';
import { ConfigController, RuntimeConfig } from './config.controller';

describe('ConfigController', () => {
  let controller: ConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigController],
    }).compile();

    controller = module.get<ConfigController>(ConfigController);
  });

  afterEach(() => {
    // Clean up environment variables after each test
    delete process.env.JELLYFIN_BASE_URL;
    delete process.env.WATCHLIST_BASE_URL;
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.HOST;
    delete process.env.HTTPS;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return default configuration when no environment variables are set', () => {
      const result: RuntimeConfig = controller.getConfig();

      expect(result).toEqual({
        jellyfin: {
          baseUrl: 'http://localhost:8096',
        },
        watchlist: {
          baseUrl: 'http://localhost:3000', // Default: http + localhost + 3000
        },
        production: false,
      });
    });

    it('should return configuration from environment variables', () => {
      // Set environment variables
      process.env.JELLYFIN_BASE_URL = 'https://jellyfin.example.com';
      process.env.NODE_ENV = 'production';
      process.env.PORT = '8080';
      process.env.HOST = '0.0.0.0';

      const result: RuntimeConfig = controller.getConfig();

      expect(result).toEqual({
        jellyfin: {
          baseUrl: 'https://jellyfin.example.com',
        },
        watchlist: {
          // Dynamically built from server configuration
          baseUrl: 'http://0.0.0.0:8080',
        },
        production: true,
      });
    });

    it('should handle partial environment variables', () => {
      // Set only some environment variables
      process.env.JELLYFIN_BASE_URL = 'https://custom-jellyfin.com';
      // Leave WATCHLIST_BASE_URL and NODE_ENV unset

      const result: RuntimeConfig = controller.getConfig();

      expect(result).toEqual({
        jellyfin: {
          baseUrl: 'https://custom-jellyfin.com',
        },
        watchlist: {
          baseUrl: 'http://localhost:3000', // Default fallback
        },
        production: false, // Default fallback
      });
    });

    it('should handle non-production NODE_ENV values', () => {
      process.env.NODE_ENV = 'development';

      const result: RuntimeConfig = controller.getConfig();

      expect(result.production).toBe(false);
    });

    it('should handle production NODE_ENV value', () => {
      process.env.NODE_ENV = 'production';

      const result: RuntimeConfig = controller.getConfig();

      expect(result.production).toBe(true);
    });

    it('should build HTTPS URL when HTTPS environment is enabled', () => {
      process.env.HTTPS = 'true';
      process.env.HOST = 'api.example.com';
      process.env.PORT = '443';

      const result: RuntimeConfig = controller.getConfig();

      expect(result.watchlist.baseUrl).toBe('https://api.example.com:443');
    });

    it('should handle custom port and host configuration', () => {
      process.env.PORT = '8080';
      process.env.HOST = '0.0.0.0';
      delete process.env.HTTPS; // Ensure HTTP

      const result: RuntimeConfig = controller.getConfig();

      expect(result.watchlist.baseUrl).toBe('http://0.0.0.0:8080');
    });
  });
});
