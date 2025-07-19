import {
  HealthCheckService,
  HealthCheckStatus,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let configService: jest.Mocked<ConfigService>;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockHttpHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockDbHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockDbHealthIndicator,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('check', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should perform health checks without Jellyfin when not configured', async () => {
      // Arrange
      configService.get.mockReturnValue(undefined);
      const expectedResult = {
        status: 'ok' as HealthCheckStatus,
        info: {},
        error: {},
        details: {},
      };
      healthCheckService.check.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.check();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(configService.get).toHaveBeenCalledWith('JELLYFIN_INSTANCE');
      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function), // Google ping check
        expect.any(Function), // Database ping check
      ]);
    });

    it('should perform health checks with Jellyfin when configured', async () => {
      // Arrange
      const jellyfinInstance = 'https://jellyfin.example.com';
      configService.get.mockReturnValue(jellyfinInstance);
      const expectedResult = {
        status: 'ok' as HealthCheckStatus,
        info: {},
        error: {},
        details: {},
      };
      healthCheckService.check.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.check();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(configService.get).toHaveBeenCalledWith('JELLYFIN_INSTANCE');
      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function), // Google ping check
        expect.any(Function), // Database ping check
        expect.any(Function), // Jellyfin ping check
      ]);
    });

    it('should handle health check errors', async () => {
      // Arrange
      configService.get.mockReturnValue(undefined);
      const error = new Error('Health check failed');
      healthCheckService.check.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.check()).rejects.toThrow('Health check failed');
      expect(healthCheckService.check).toHaveBeenCalled();
    });
  });
});
