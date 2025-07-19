import { Repository } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { WatchlistItem } from '../entities/watchlist-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

/**
 * Test data factory for creating WatchlistItem test fixtures
 */
export class WatchlistItemFactory {
  static create(overrides: Partial<WatchlistItem> = {}): WatchlistItem {
    const defaultItem: WatchlistItem = {
      id: 'test-item-123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2023,
      primaryImageUrl: 'https://example.com/image.jpg',
      jellyfinUserId: 'user-123',
      addedOn: new Date('2023-01-01T00:00:00Z'),
    };

    return { ...defaultItem, ...overrides };
  }

  static createMultiple(count: number, overrides: Partial<WatchlistItem> = {}): WatchlistItem[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        id: `test-item-${index + 1}`,
        name: `Test Movie ${index + 1}`,
        ...overrides,
      }),
    );
  }
}

/**
 * Mock repository factory for TypeORM repositories
 */
export const createMockRepository = () => ({
  findBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

/**
 * Common test constants
 */
export const TEST_CONSTANTS = {
  USER_ID: 'test-user-123',
  ITEM_ID: 'test-item-123',
  INVALID_USER_ID: 'invalid-user',
  INVALID_ITEM_ID: 'invalid-item',
};

/**
 * Integration test helpers for database operations
 */
export class IntegrationTestHelpers {
  /**
   * Clear all data from the test database
   */
  static async clearDatabase(module: TestingModule): Promise<void> {
    const watchlistRepo = module.get<Repository<WatchlistItem>>(getRepositoryToken(WatchlistItem));
    await watchlistRepo.clear();
  }

  /**
   * Seed the database with test data
   */
  static async seedDatabase(
    module: TestingModule,
    items: WatchlistItem[],
  ): Promise<WatchlistItem[]> {
    const watchlistRepo = module.get<Repository<WatchlistItem>>(getRepositoryToken(WatchlistItem));
    return watchlistRepo.save(items);
  }

  /**
   * Get repository instance for direct database testing
   */
  static getRepository(module: TestingModule): Repository<WatchlistItem> {
    return module.get<Repository<WatchlistItem>>(getRepositoryToken(WatchlistItem));
  }
}

/**
 * Additional test constants for integration tests
 */
export const INTEGRATION_TEST_CONSTANTS = {
  ...TEST_CONSTANTS,
  MULTIPLE_USERS: ['user-1', 'user-2', 'user-3'],
  LARGE_DATASET_SIZE: 50,
};
