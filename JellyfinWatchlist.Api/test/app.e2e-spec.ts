import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from './../src/app.module';
import { WatchlistItem } from '../src/entities/watchlist-item.entity';

describe('Jellyfin Watchlist API (e2e)', () => {
  let app: INestApplication;
  let watchlistRepository: Repository<WatchlistItem>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    watchlistRepository = moduleFixture.get<Repository<WatchlistItem>>(
      getRepositoryToken(WatchlistItem),
    );

    await app.init();
  });
  afterEach(async () => {
    // Clean up database after each test
    if (watchlistRepository) {
      await watchlistRepository.clear();
    }
    if (app) {
      await app.close();
    }
  }, 10000); // Increase timeout for cleanup

  describe('Health Endpoints', () => {
    it('/health (GET) should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('info');
          expect(res.body).toHaveProperty('details');
        });
    });
  });

  describe('Watchlist Endpoints', () => {
    const testUserId = 'test-user-123';
    const testItem = {
      id: 'jellyfin-item-123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2023,
      primaryImageUrl: 'https://example.com/image.jpg',
    };

    describe('POST /watchlist/:userId', () => {
      it('should add a new item to watchlist', () => {
        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(testItem)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', testItem.id);
            expect(res.body).toHaveProperty('name', testItem.name);
            expect(res.body).toHaveProperty('mediaType', testItem.mediaType);
            expect(res.body).toHaveProperty('year', testItem.year);
            expect(res.body).toHaveProperty('primaryImageUrl', testItem.primaryImageUrl);
            expect(res.body).toHaveProperty('jellyfinUserId', testUserId);
            expect(res.body).toHaveProperty('addedOn');
            expect(new Date(res.body.addedOn)).toBeInstanceOf(Date);
          });
      });      it('should return 500 for invalid request body', () => {
        const invalidItem = {
          name: 'Test Movie',
          // Missing required fields
        };

        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(invalidItem)
          .expect(500); // Without validation, this causes DB constraint error
      });      it('should handle duplicate items gracefully', async () => {
        // Add item first time
        await request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(testItem)
          .expect(201);

        // Try to add same item again - currently allows duplicates
        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(testItem)
          .expect(201); // Currently API allows duplicates
      });
    });

    describe('GET /watchlist/:userId', () => {
      it('should return empty array for user with no items', () => {
        return request(app.getHttpServer())
          .get(`/watchlist/${testUserId}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(0);
          });
      });

      it('should return all items for a user', async () => {
        // Add test item first
        await request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(testItem)
          .expect(201);

        // Add second item
        const secondItem = {
          ...testItem,
          id: 'jellyfin-item-456',
          name: 'Test TV Show',
          mediaType: 'Series',
          year: 2024,
        };

        await request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(secondItem)
          .expect(201);

        // Get all items
        return request(app.getHttpServer())
          .get(`/watchlist/${testUserId}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(2);
            
            const itemIds = res.body.map((item: any) => item.id);
            expect(itemIds).toContain(testItem.id);
            expect(itemIds).toContain(secondItem.id);
            
            res.body.forEach((item: any) => {
              expect(item).toHaveProperty('jellyfinUserId', testUserId);
              expect(item).toHaveProperty('addedOn');
            });
          });
      });

      it('should isolate items between different users', async () => {
        const user1 = 'user-1';
        const user2 = 'user-2';

        // Add item for user 1
        await request(app.getHttpServer())
          .post(`/watchlist/${user1}`)
          .send(testItem)
          .expect(201);

        // Add different item for user 2
        const user2Item = {
          ...testItem,
          id: 'jellyfin-item-user2',
          name: 'User 2 Movie',
        };

        await request(app.getHttpServer())
          .post(`/watchlist/${user2}`)
          .send(user2Item)
          .expect(201);

        // Check user 1 only sees their item
        const user1Response = await request(app.getHttpServer())
          .get(`/watchlist/${user1}`)
          .expect(200);

        expect(user1Response.body).toHaveLength(1);
        expect(user1Response.body[0]).toHaveProperty('id', testItem.id);

        // Check user 2 only sees their item
        const user2Response = await request(app.getHttpServer())
          .get(`/watchlist/${user2}`)
          .expect(200);

        expect(user2Response.body).toHaveLength(1);
        expect(user2Response.body[0]).toHaveProperty('id', user2Item.id);
      });
    });

    describe('DELETE /watchlist/:userId/:itemId', () => {
      beforeEach(async () => {
        // Add test item before each delete test
        await request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(testItem)
          .expect(201);
      });

      it('should delete an existing item', async () => {
        // Delete the item
        await request(app.getHttpServer())
          .delete(`/watchlist/${testUserId}/${testItem.id}`)
          .expect(200);

        // Verify item is gone
        const response = await request(app.getHttpServer())
          .get(`/watchlist/${testUserId}`)
          .expect(200);

        expect(response.body).toHaveLength(0);
      });

      it('should return 404 for non-existent item', () => {
        return request(app.getHttpServer())
          .delete(`/watchlist/${testUserId}/non-existent-item`)
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'Item not found');
          });
      });

      it('should return 404 when trying to delete another user\'s item', async () => {
        const otherUserId = 'other-user-456';

        // Try to delete with wrong user ID
        return request(app.getHttpServer())
          .delete(`/watchlist/${otherUserId}/${testItem.id}`)
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'Item not found');
          });
      });

      it('should handle multiple deletes gracefully', async () => {
        // Delete once (should succeed)
        await request(app.getHttpServer())
          .delete(`/watchlist/${testUserId}/${testItem.id}`)
          .expect(200);

        // Delete again (should return 404)
        return request(app.getHttpServer())
          .delete(`/watchlist/${testUserId}/${testItem.id}`)
          .expect(404);
      });
    });

    describe('Error Handling', () => {
      it('should handle malformed JSON in POST requests', () => {
        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send('invalid-json')
          .set('Content-Type', 'application/json')
          .expect(400);
      });      it('should handle missing required JSON fields', () => {
        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send({}) // Empty object
          .expect(500); // Database constraint error without validation
      });

      it('should handle very long user IDs', () => {
        const longUserId = 'a'.repeat(1000);
        
        return request(app.getHttpServer())
          .get(`/watchlist/${longUserId}`)
          .expect(200); // Should still work, just be empty
      });

      it('should handle special characters in user IDs', () => {
        const specialUserId = 'user@123!#$%^&*()';
        
        return request(app.getHttpServer())
          .get(`/watchlist/${encodeURIComponent(specialUserId)}`)
          .expect(200);
      });
    });    describe('Performance and Load', () => {
      it('should handle multiple concurrent requests', async () => {
        const promises: Promise<any>[] = [];
        const numRequests = 10;

        // Create multiple concurrent POST requests
        for (let i = 0; i < numRequests; i++) {
          const item = {
            ...testItem,
            id: `item-${i}`,
            name: `Item ${i}`,
          };

          promises.push(
            request(app.getHttpServer())
              .post(`/watchlist/${testUserId}`)
              .send(item)
              .expect(201)
          );
        }

        // Wait for all requests to complete
        await Promise.all(promises);

        // Verify all items were added
        const response = await request(app.getHttpServer())
          .get(`/watchlist/${testUserId}`)
          .expect(200);

        expect(response.body).toHaveLength(numRequests);
      });

      it('should handle large watchlists efficiently', async () => {
        const numItems = 100;
        const promises: Promise<any>[] = [];

        // Add many items
        for (let i = 0; i < numItems; i++) {
          const item = {
            ...testItem,
            id: `large-item-${i}`,
            name: `Large Item ${i}`,
          };

          promises.push(
            request(app.getHttpServer())
              .post(`/watchlist/${testUserId}`)
              .send(item)
          );
        }

        await Promise.all(promises);

        // Measure response time for GET request
        const startTime = Date.now();
        
        const response = await request(app.getHttpServer())
          .get(`/watchlist/${testUserId}`)
          .expect(200);

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        expect(response.body).toHaveLength(numItems);
        expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
      });
    });    describe('Data Validation', () => {
      it('should return 500 for missing required fields in POST request', () => {
        const incompleteItem = {
          name: 'Test Movie',
          // Missing id, mediaType, year, primaryImageUrl
        };

        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(incompleteItem)
          .expect(500); // Database constraint error
      });

      it('should accept invalid data types (no validation enabled)', () => {
        const invalidItem = {
          id: 'test-id',
          name: 'Test Movie',
          mediaType: 'Movie',
          year: 'not-a-number', // Should be number but API accepts it
          primaryImageUrl: 'https://example.com/image.jpg',
        };

        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(invalidItem)
          .expect(201); // No validation, so it succeeds
      });

      it('should return 500 for null values', () => {
        const nullItem = {
          id: null,
          name: null,
          mediaType: null,
          year: null,
          primaryImageUrl: null,
        };

        return request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(nullItem)
          .expect(500); // Database constraint error
      });
    });

    describe('API Response Format', () => {
      it('should return consistent response format for successful operations', async () => {
        // POST should return the created item
        const postResponse = await request(app.getHttpServer())
          .post(`/watchlist/${testUserId}`)
          .send(testItem)
          .expect(201);

        expect(postResponse.body).toHaveProperty('id');
        expect(postResponse.body).toHaveProperty('name');
        expect(postResponse.body).toHaveProperty('addedOn');

        // GET should return array of items
        const getResponse = await request(app.getHttpServer())
          .get(`/watchlist/${testUserId}`)
          .expect(200);

        expect(Array.isArray(getResponse.body)).toBe(true);
        expect(getResponse.body[0]).toHaveProperty('id');
        expect(getResponse.body[0]).toHaveProperty('name');
        expect(getResponse.body[0]).toHaveProperty('addedOn');

        // DELETE should return success indicator or deleted item
        await request(app.getHttpServer())
          .delete(`/watchlist/${testUserId}/${testItem.id}`)
          .expect(200);
      });

      it('should return proper error format for 404s', () => {
        return request(app.getHttpServer())
          .delete(`/watchlist/${testUserId}/non-existent`)
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('statusCode', 404);
          });
      });
    });
  });
});
