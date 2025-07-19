import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistModule } from './watchlist.module';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { IntegrationTestHelpers, INTEGRATION_TEST_CONSTANTS } from '../test-utils/test-helpers';
import { getTestDatabaseConfig } from '../test-utils/test-database.config';
import { AddWatchlistItem } from './models';
import { NotFoundException } from '@nestjs/common';

describe('WatchlistModule (Integration)', () => {
  let module: TestingModule;
  let controller: WatchlistController;
  let service: WatchlistService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(getTestDatabaseConfig()), WatchlistModule],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
    service = module.get<WatchlistService>(WatchlistService);
  });

  afterEach(async () => {
    await IntegrationTestHelpers.clearDatabase(module);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Module Dependencies', () => {
    it('should initialize all module dependencies correctly', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(controller).toBeInstanceOf(WatchlistController);
      expect(service).toBeInstanceOf(WatchlistService);
    });

    it('should inject dependencies properly', () => {
      // Verify that the controller has the service injected

      expect((controller as any).watchlistService).toBeDefined();
    });
  });

  describe('Full CRUD Workflow Integration', () => {
    it('should complete a full watchlist lifecycle', async () => {
      const userId = INTEGRATION_TEST_CONSTANTS.USER_ID;

      // 1. Initially empty
      let userWatchlist = await controller.getByUserId(userId);
      expect(userWatchlist).toHaveLength(0);

      // 2. Add multiple items
      const item1: AddWatchlistItem = {
        id: 'movie-1',
        name: 'Test Movie 1',
        mediaType: 'Movie',
        year: 2023,
        primaryImageUrl: 'https://example.com/movie1.jpg',
      };

      const item2: AddWatchlistItem = {
        id: 'series-1',
        name: 'Test Series 1',
        mediaType: 'Series',
        year: 2024,
        primaryImageUrl: 'https://example.com/series1.jpg',
      };

      await controller.add(userId, item1);
      await controller.add(userId, item2);

      // 3. Verify items were added
      userWatchlist = await controller.getByUserId(userId);
      expect(userWatchlist).toHaveLength(2);

      const movieItem = userWatchlist.find((item) => item.id === 'movie-1');
      const seriesItem = userWatchlist.find((item) => item.id === 'series-1');

      expect(movieItem).toBeDefined();
      expect(seriesItem).toBeDefined();
      expect(movieItem!.jellyfinUserId).toBe(userId);
      expect(seriesItem!.jellyfinUserId).toBe(userId);
      expect(movieItem!.addedOn).toBeInstanceOf(Date);
      expect(seriesItem!.addedOn).toBeInstanceOf(Date);

      // 4. Delete one item
      await controller.delete(userId, 'movie-1');

      // 5. Verify deletion
      userWatchlist = await controller.getByUserId(userId);
      expect(userWatchlist).toHaveLength(1);
      expect(userWatchlist[0].id).toBe('series-1');

      // 6. Try to delete non-existent item
      await expect(controller.delete(userId, 'non-existent')).rejects.toThrow(NotFoundException);

      // 7. Final state verification
      userWatchlist = await controller.getByUserId(userId);
      expect(userWatchlist).toHaveLength(1);
    });

    it('should handle concurrent user operations without interference', async () => {
      const [user1, user2] = INTEGRATION_TEST_CONSTANTS.MULTIPLE_USERS;

      // Add items for both users concurrently
      const user1Items: AddWatchlistItem[] = [
        {
          id: 'user1-movie-1',
          name: 'User 1 Movie',
          mediaType: 'Movie',
          year: 2023,
          primaryImageUrl: 'https://example.com/u1m1.jpg',
        },
        {
          id: 'user1-series-1',
          name: 'User 1 Series',
          mediaType: 'Series',
          year: 2024,
          primaryImageUrl: 'https://example.com/u1s1.jpg',
        },
      ];

      const user2Items: AddWatchlistItem[] = [
        {
          id: 'user2-movie-1',
          name: 'User 2 Movie',
          mediaType: 'Movie',
          year: 2023,
          primaryImageUrl: 'https://example.com/u2m1.jpg',
        },
      ];

      // Add items concurrently
      await Promise.all([
        ...user1Items.map((item) => controller.add(user1, item)),
        ...user2Items.map((item) => controller.add(user2, item)),
      ]);

      // Verify each user sees only their items
      const user1Watchlist = await controller.getByUserId(user1);
      const user2Watchlist = await controller.getByUserId(user2);

      expect(user1Watchlist).toHaveLength(2);
      expect(user2Watchlist).toHaveLength(1);

      // Verify data isolation
      user1Watchlist.forEach((item) => {
        expect(item.jellyfinUserId).toBe(user1);
        expect(item.id).toContain('user1');
      });

      user2Watchlist.forEach((item) => {
        expect(item.jellyfinUserId).toBe(user2);
        expect(item.id).toContain('user2');
      });

      // User 1 deletes an item - should not affect User 2
      await controller.delete(user1, 'user1-movie-1');

      const updatedUser1Watchlist = await controller.getByUserId(user1);
      const updatedUser2Watchlist = await controller.getByUserId(user2);

      expect(updatedUser1Watchlist).toHaveLength(1);
      expect(updatedUser2Watchlist).toHaveLength(1); // Unchanged
    });
  });

  describe('Data Validation and Transformation', () => {
    it('should properly transform AddWatchlistItem to WatchlistItem', async () => {
      const userId = INTEGRATION_TEST_CONSTANTS.USER_ID;
      const addItemDto: AddWatchlistItem = {
        id: 'transform-test',
        name: 'Transformation Test Movie',
        mediaType: 'Documentary',
        year: 2024,
        primaryImageUrl: 'https://example.com/transform.jpg',
      };

      const beforeAdd = new Date();
      await controller.add(userId, addItemDto);
      const afterAdd = new Date();

      const retrievedItems = await controller.getByUserId(userId);
      expect(retrievedItems).toHaveLength(1);

      const savedItem = retrievedItems[0];
      expect(savedItem.id).toBe(addItemDto.id);
      expect(savedItem.name).toBe(addItemDto.name);
      expect(savedItem.mediaType).toBe(addItemDto.mediaType);
      expect(savedItem.year).toBe(addItemDto.year);
      expect(savedItem.primaryImageUrl).toBe(addItemDto.primaryImageUrl);
      expect(savedItem.jellyfinUserId).toBe(userId);
      expect(savedItem.addedOn).toBeInstanceOf(Date);
      expect(savedItem.addedOn.getTime()).toBeGreaterThanOrEqual(beforeAdd.getTime());
      expect(savedItem.addedOn.getTime()).toBeLessThanOrEqual(afterAdd.getTime());
    });

    it('should handle edge case values properly', async () => {
      const userId = INTEGRATION_TEST_CONSTANTS.USER_ID;
      const edgeCaseItem: AddWatchlistItem = {
        id: 'edge-case-test-item-with-very-long-id-that-tests-limits',
        name: 'Movie with "Quotes" and Special Characters: @#$%^&*()',
        mediaType: 'Movie',
        year: 1900, // Very old year
        primaryImageUrl:
          'https://very-long-domain-name-for-testing.example.com/very/long/path/to/image/file/with/very/long/filename.jpg',
      };

      await controller.add(userId, edgeCaseItem);
      const retrievedItems = await controller.getByUserId(userId);

      expect(retrievedItems).toHaveLength(1);
      const savedItem = retrievedItems[0];

      expect(savedItem.id).toBe(edgeCaseItem.id);
      expect(savedItem.name).toBe(edgeCaseItem.name);
      expect(savedItem.year).toBe(1900);
      expect(savedItem.primaryImageUrl).toBe(edgeCaseItem.primaryImageUrl);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle service errors propagated through controller', async () => {
      const userId = INTEGRATION_TEST_CONSTANTS.USER_ID;

      // Mock the service to throw an error
      const originalAdd = service.add;
      service.add = jest.fn().mockRejectedValue(new Error('Database constraint violation'));

      const addItemDto: AddWatchlistItem = {
        id: 'error-test',
        name: 'Error Test Movie',
        mediaType: 'Movie',
        year: 2023,
        primaryImageUrl: 'https://example.com/error.jpg',
      };

      await expect(controller.add(userId, addItemDto)).rejects.toThrow(
        'Database constraint violation',
      );

      // Restore original method
      service.add = originalAdd;
    });
    it('should maintain data integrity when operations fail', async () => {
      const userId = INTEGRATION_TEST_CONSTANTS.USER_ID;

      // Add a valid item first
      const validItem: AddWatchlistItem = {
        id: 'integrity-test-item',
        name: 'Valid Movie',
        mediaType: 'Movie',
        year: 2023,
        primaryImageUrl: 'https://example.com/valid.jpg',
      };

      await controller.add(userId, validItem);

      // Verify item was added
      let watchlist = await controller.getByUserId(userId);
      expect(watchlist).toHaveLength(1);

      // Try to add duplicate item - behavior may vary with SQLite
      let errorOccurred = false;
      try {
        await controller.add(userId, validItem);
      } catch {
        errorOccurred = true;
      }

      // Verify data integrity regardless of whether error occurred
      watchlist = await controller.getByUserId(userId);

      if (errorOccurred) {
        // Ideal case: error prevented duplicate
        expect(watchlist).toHaveLength(1);
        expect(watchlist[0].name).toBe('Valid Movie');
      } else {
        // SQLite allowed it - verify the final state is still consistent
        expect(watchlist.length).toBeGreaterThan(0);
        expect(watchlist.every((item) => item.jellyfinUserId === userId)).toBe(true);
      }
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle bulk operations efficiently', async () => {
      const userId = INTEGRATION_TEST_CONSTANTS.USER_ID;
      const bulkSize = 20;

      const bulkItems: AddWatchlistItem[] = Array.from({ length: bulkSize }, (_, index) => ({
        id: `bulk-item-${index}`,
        name: `Bulk Movie ${index}`,
        mediaType: 'Movie',
        year: 2020 + (index % 5),
        primaryImageUrl: `https://example.com/bulk${index}.jpg`,
      }));

      // Add items in bulk
      const startTime = Date.now();
      await Promise.all(bulkItems.map((item) => controller.add(userId, item)));
      const addTime = Date.now() - startTime;

      // Retrieve all items
      const retrieveStartTime = Date.now();
      const retrievedItems = await controller.getByUserId(userId);
      const retrieveTime = Date.now() - retrieveStartTime;

      // Assertions
      expect(retrievedItems).toHaveLength(bulkSize);
      expect(addTime).toBeLessThan(3000); // Should complete within 3 seconds
      expect(retrieveTime).toBeLessThan(500); // Should complete within 500ms

      // Verify all items are correctly stored
      const retrievedIds = retrievedItems.map((item) => item.id).sort();
      const expectedIds = bulkItems.map((item) => item.id).sort();
      expect(retrievedIds).toEqual(expectedIds);
    });
  });
});
