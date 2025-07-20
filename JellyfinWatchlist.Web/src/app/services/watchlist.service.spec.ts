import { AddWatchlistItem, WatchlistItem } from '../shared/models';
import { SpectatorService, SpyObject, createServiceFactory } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { WatchlistService } from './watchlist.service';
import { environment } from '../../environments/environment';

describe('WatchlistService', () => {
  let spectator: SpectatorService<WatchlistService>;
  let service: WatchlistService;
  let httpClient: SpyObject<HttpClient>;

  const createService = createServiceFactory({
    service: WatchlistService,
    mocks: [HttpClient],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpClient = spectator.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWatchlist', () => {
    const mockUserId = 'user-123';
    const mockWatchlistItems: WatchlistItem[] = [
      {
        id: 'movie-1',
        name: 'Test Movie 1',
        mediaType: 'Movie',
        year: 2023,
        primaryImageUrl: 'http://example.com/image1.jpg',
        jellyfinUserId: mockUserId,
        addedOn: new Date('2023-01-01'),
      },
      {
        id: 'series-1',
        name: 'Test Series 1',
        mediaType: 'Series',
        year: 2022,
        primaryImageUrl: 'http://example.com/image2.jpg',
        jellyfinUserId: mockUserId,
        addedOn: new Date('2023-01-02'),
      },
    ];

    it('should make GET request to correct URL', () => {
      httpClient.get.and.returnValue(of(mockWatchlistItems));

      service.getWatchlist(mockUserId).subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/${mockUserId}`,
      );
    });

    it('should return watchlist items for user', (done) => {
      httpClient.get.and.returnValue(of(mockWatchlistItems));

      service.getWatchlist(mockUserId).subscribe({
        next: (items) => {
          expect(items).toEqual(mockWatchlistItems);
          expect(items.length).toBe(2);
          done();
        },
      });
    });

    it('should return empty array when user has no items', (done) => {
      httpClient.get.and.returnValue(of([]));

      service.getWatchlist(mockUserId).subscribe({
        next: (items) => {
          expect(items).toEqual([]);
          expect(items.length).toBe(0);
          done();
        },
      });
    });

    it('should handle HTTP errors', (done) => {
      const errorResponse = { status: 500, message: 'Server Error' };
      httpClient.get.and.returnValue(throwError(() => errorResponse));

      service.getWatchlist(mockUserId).subscribe({
        error: (error) => {
          expect(error).toEqual(errorResponse);
          done();
        },
      });
    });

    it('should handle different user IDs', () => {
      const differentUserId = 'user-456';
      httpClient.get.and.returnValue(of([]));

      service.getWatchlist(differentUserId).subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/${differentUserId}`,
      );
    });
  });

  describe('addWatchlistItem', () => {
    const mockUserId = 'user-123';
    const mockAddItem: AddWatchlistItem = {
      id: 'new-movie-1',
      name: 'New Test Movie',
      mediaType: 'Movie',
      year: 2024,
      primaryImageUrl: 'http://example.com/new-image.jpg',
    };
    const mockCreatedItem: WatchlistItem = {
      ...mockAddItem,
      jellyfinUserId: mockUserId,
      addedOn: new Date('2024-01-01'),
    };

    it('should make POST request to correct URL with item data', () => {
      httpClient.post.and.returnValue(of(mockCreatedItem));

      service.addWatchlistItem(mockUserId, mockAddItem).subscribe();

      expect(httpClient.post).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/${mockUserId}`,
        mockAddItem,
      );
    });

    it('should return created watchlist item', (done) => {
      httpClient.post.and.returnValue(of(mockCreatedItem));

      service.addWatchlistItem(mockUserId, mockAddItem).subscribe({
        next: (item) => {
          expect(item).toEqual(mockCreatedItem);
          expect(item.jellyfinUserId).toBe(mockUserId);
          expect(item.addedOn).toBeDefined();
          done();
        },
      });
    });

    it('should handle validation errors', (done) => {
      const validationError = { status: 400, message: 'Invalid item data' };
      httpClient.post.and.returnValue(throwError(() => validationError));

      service.addWatchlistItem(mockUserId, mockAddItem).subscribe({
        error: (error) => {
          expect(error).toEqual(validationError);
          done();
        },
      });
    });

    it('should handle different media types', () => {
      const seriesItem: AddWatchlistItem = {
        ...mockAddItem,
        id: 'series-2',
        name: 'New Test Series',
        mediaType: 'Series',
      };
      httpClient.post.and.returnValue(
        of({ ...seriesItem, jellyfinUserId: mockUserId, addedOn: new Date() }),
      );

      service.addWatchlistItem(mockUserId, seriesItem).subscribe();

      expect(httpClient.post).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/${mockUserId}`,
        seriesItem,
      );
    });

    it('should handle duplicate item conflicts', (done) => {
      const conflictError = { status: 409, message: 'Item already exists' };
      httpClient.post.and.returnValue(throwError(() => conflictError));

      service.addWatchlistItem(mockUserId, mockAddItem).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        },
      });
    });
  });

  describe('removeWatchlistItem', () => {
    const mockUserId = 'user-123';
    const mockItemId = 'movie-1';

    it('should make DELETE request to correct URL', () => {
      httpClient.delete.and.returnValue(of({}));

      service.removeWatchlistItem(mockUserId, mockItemId).subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/${mockUserId}/${mockItemId}`,
      );
    });

    it('should complete successfully on successful deletion', (done) => {
      httpClient.delete.and.returnValue(of({}));

      service.removeWatchlistItem(mockUserId, mockItemId).subscribe({
        next: (response) => {
          expect(response).toEqual({});
          done();
        },
      });
    });

    it('should handle item not found errors', (done) => {
      const notFoundError = { status: 404, message: 'Item not found' };
      httpClient.delete.and.returnValue(throwError(() => notFoundError));

      service.removeWatchlistItem(mockUserId, mockItemId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });
    });

    it('should handle unauthorized access', (done) => {
      const unauthorizedError = { status: 403, message: 'Unauthorized' };
      httpClient.delete.and.returnValue(throwError(() => unauthorizedError));

      service.removeWatchlistItem(mockUserId, mockItemId).subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        },
      });
    });

    it('should handle different item IDs', () => {
      const differentItemId = 'series-5';
      httpClient.delete.and.returnValue(of({}));

      service.removeWatchlistItem(mockUserId, differentItemId).subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/${mockUserId}/${differentItemId}`,
      );
    });
  });

  describe('service configuration', () => {
    it('should use correct base URL from environment', () => {
      // This tests that the service constructs URLs correctly
      httpClient.get.and.returnValue(of([]));

      service.getWatchlist('test-user').subscribe();

      expect(httpClient.get).toHaveBeenCalledWith(
        `${environment.watchlist.baseUrl}/watchlist/test-user`,
      );
    });

    it('should be provided in root', () => {
      // Test that the service is properly injectable
      expect(service).toBeInstanceOf(WatchlistService);
    });
  });

  describe('error handling patterns', () => {
    const mockUserId = 'user-123';

    it('should propagate network errors for all methods', () => {
      const networkError = new Error('Network failure');

      httpClient.get.and.returnValue(throwError(() => networkError));
      httpClient.post.and.returnValue(throwError(() => networkError));
      httpClient.delete.and.returnValue(throwError(() => networkError));

      // Test all methods propagate errors
      service
        .getWatchlist(mockUserId)
        .subscribe({ error: (err) => expect(err).toBe(networkError) });
      service
        .addWatchlistItem(mockUserId, {} as AddWatchlistItem)
        .subscribe({ error: (err) => expect(err).toBe(networkError) });
      service
        .removeWatchlistItem(mockUserId, 'item-1')
        .subscribe({ error: (err) => expect(err).toBe(networkError) });
    });

    it('should handle server errors consistently', (done) => {
      const serverError = { status: 500, message: 'Internal Server Error' };
      httpClient.get.and.returnValue(throwError(() => serverError));

      service.getWatchlist(mockUserId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.message).toContain('Internal Server Error');
          done();
        },
      });
    });
  });
});
