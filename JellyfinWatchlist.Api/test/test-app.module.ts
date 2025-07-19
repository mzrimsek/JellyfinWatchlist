import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '../src/health/health.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistModule } from '../src/watchlist/watchlist.module';
import { getTestDatabaseConfig, setupTestEnvironment } from '../src/test-utils';

// Ensure test environment is configured
setupTestEnvironment();

/**
 * Test-specific AppModule for E2E tests
 * Uses in-memory database instead of production database configuration
 */
@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        JELLYFIN_INSTANCE: Joi.string().required(),
        CONFIG_PATH: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      isGlobal: true,
    }),
    // Use test database configuration instead of production config
    TypeOrmModule.forRoot(getTestDatabaseConfig()),
    WatchlistModule,
  ],
})
export class TestAppModule {}
