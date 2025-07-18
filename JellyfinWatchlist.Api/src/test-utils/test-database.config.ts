import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WatchlistItem } from '../entities/watchlist-item.entity';

export const getTestDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: ':memory:', // Use in-memory database for tests
  entities: [WatchlistItem],
  synchronize: true, // Auto-create schema for tests
  dropSchema: true, // Clean database before each test
  logging: false, // Disable logging in tests
});
