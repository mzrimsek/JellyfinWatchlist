/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models';
import { TestBed } from '@angular/core/testing';
import { WatchlistActions } from '../actions/watchlist.actions';
import { WatchlistEffects } from './watchlist.effects';
import { WatchlistItem } from '../shared/models';
import { WatchlistService } from '../services/watchlist.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';

// Mock data
const mockItem: WatchlistItem = {
  id: 'movie123',
  name: 'Test Movie',
  mediaType: BaseItemKind.Movie,
  year: 2024,
  primaryImageUrl: 'http://jellyfin.local/image.jpg',
  jellyfinUserId: 'user-123',
  addedOn: new Date('2024-01-01'),
};

const mockItem2: WatchlistItem = {
  id: 'series456',
  name: 'Test Series',
  mediaType: BaseItemKind.Series,
  year: 2023,
  primaryImageUrl: 'http://jellyfin.local/series.jpg',
  jellyfinUserId: 'user-456',
  addedOn: new Date('2024-01-02'),
};

const numericIdItem: WatchlistItem = {
  id: '12345',
  name: 'Numeric ID Item',
  mediaType: BaseItemKind.Movie,
  year: 2024,
  primaryImageUrl: 'http://jellyfin.local/numeric.jpg',
  jellyfinUserId: 'user-123',
  addedOn: new Date('2024-01-01'),
};

const uppercaseIdItem: WatchlistItem = {
  id: 'UPPERCASE123',
  name: 'Uppercase ID Item',
  mediaType: BaseItemKind.Movie,
  year: 2024,
  primaryImageUrl: 'http://jellyfin.local/uppercase.jpg',
  jellyfinUserId: 'user-123',
  addedOn: new Date('2024-01-01'),
};

describe('WatchlistEffects', () => {
  let actions$: Observable<Action>;
  let effects: WatchlistEffects;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select']);
    const watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', [
      'addWatchlistItem',
      'removeWatchlistItem',
      'getWatchlist',
    ]);

    TestBed.configureTestingModule({
      providers: [
        WatchlistEffects,
        provideHttpClientTesting(),
        provideMockActions(() => actions$),
        { provide: Store, useValue: storeSpy },
        { provide: WatchlistService, useValue: watchlistServiceSpy },
      ],
    });

    effects = TestBed.inject(WatchlistEffects);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  describe('itemSelected$', () => {
    it('should return WatchlistActions.addItem when action is add', (done) => {
      const payload = { item: mockItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: mockItem });

      actions$ = of(action);

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return WatchlistActions.removeItem when action is remove', (done) => {
      const payload = { item: mockItem, action: 'remove' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.removeItem({ itemId: mockItem.id });

      actions$ = of(action);

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle different item types correctly', (done) => {
      const payload = { item: mockItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: mockItem });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle numeric item IDs correctly', (done) => {
      const payload = { item: numericIdItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: numericIdItem });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle uppercase item IDs correctly', (done) => {
      const payload = { item: uppercaseIdItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: uppercaseIdItem });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle multiple rapid selections correctly', (done) => {
      const payload1 = { item: mockItem, action: 'add' as const };
      const payload2 = { item: mockItem2, action: 'add' as const };
      const action1 = WatchlistActions.selectItem({ payload: payload1 });
      const action2 = WatchlistActions.selectItem({ payload: payload2 });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action1, action2);
      store.select.and.returnValue(of(existingWatchlistIds));

      let emissionCount = 0;
      effects.itemSelected$.subscribe((result) => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(result).toEqual(WatchlistActions.addItem({ item: mockItem }));
        } else if (emissionCount === 2) {
          expect(result).toEqual(WatchlistActions.addItem({ item: mockItem2 }));
          done();
        }
      });
    });

    it('should handle empty watchlist IDs array', (done) => {
      const payload = { item: mockItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: mockItem });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle large watchlist IDs array', (done) => {
      const payload = { item: mockItem, action: 'remove' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.removeItem({ itemId: mockItem.id });
      const largeWatchlistIds = Array.from({ length: 100 }, (_, i) => `item${i}`);
      largeWatchlistIds.push(mockItem.id); // Include our test item

      actions$ = of(action);
      store.select.and.returnValue(of(largeWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle adding new item not in watchlist', (done) => {
      const newItem: WatchlistItem = {
        id: 'newitem123',
        name: 'New Test Item',
        mediaType: BaseItemKind.Movie,
        year: 2025,
        primaryImageUrl: 'http://jellyfin.local/newitem.jpg',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };
      const payload = { item: newItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: newItem });
      const existingWatchlistIds = [mockItem.id, mockItem2.id]; // newItem not included

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle removing existing item from watchlist', (done) => {
      const existingItem = mockItem;
      const payload = { item: existingItem, action: 'remove' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.removeItem({ itemId: existingItem.id });
      const existingWatchlistIds = [existingItem.id, mockItem2.id]; // existingItem included

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle different media types (Albums, Books, etc.)', (done) => {
      const albumItem: WatchlistItem = {
        id: 'album789',
        name: 'Test Album',
        mediaType: BaseItemKind.MusicAlbum,
        year: 2022,
        primaryImageUrl: 'http://jellyfin.local/album.jpg',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };
      const payload = { item: albumItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: albumItem });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle case sensitivity in ID matching', (done) => {
      const payload = { item: mockItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const expectedAction = WatchlistActions.addItem({ item: mockItem });
      const existingWatchlistIds = ['MOVIE123', 'series456']; // Different case

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle mixed add and remove actions', (done) => {
      const addPayload = { item: mockItem, action: 'add' as const };
      const removePayload = { item: mockItem, action: 'remove' as const };
      const addAction = WatchlistActions.selectItem({ payload: addPayload });
      const removeAction = WatchlistActions.selectItem({ payload: removePayload });

      actions$ = of(addAction, removeAction);

      const results: any[] = [];
      effects.itemSelected$.subscribe({
        next: (result) => {
          results.push(result);
          if (results.length === 2) {
            expect(results[0]).toEqual(WatchlistActions.addItem({ item: mockItem }));
            expect(results[1]).toEqual(WatchlistActions.removeItem({ itemId: mockItem.id }));
            done();
          }
        },
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle adding item to existing watchlist', (done) => {
      const newItem = { ...mockItem, id: 'newMovie999' };
      const payload = { item: newItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const existingWatchlist = ['movie123', 'series456'];

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlist));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.addItem({ item: newItem }));
        done();
      });
    });

    it('should handle removing item from full watchlist', (done) => {
      const existingItem = { ...mockItem, id: 'movie123' };
      const payload = { item: existingItem, action: 'remove' as const };
      const action = WatchlistActions.selectItem({ payload });
      const fullWatchlist = ['movie123', 'series456', 'album789', 'book101'];

      actions$ = of(action);
      store.select.and.returnValue(of(fullWatchlist));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.removeItem({ itemId: existingItem.id }));
        done();
      });
    });

    it('should handle different media types consistently', (done) => {
      const albumItem = {
        id: 'album123',
        name: 'Test Album',
        mediaType: 'MusicAlbum' as any,
        year: 2024,
        primaryImageUrl: 'http://jellyfin.local/album.jpg',
        jellyfinUserId: 'user-789',
        addedOn: new Date('2024-01-03'),
      };
      const payload = { item: albumItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const watchlistWithoutAlbum = ['movie123', 'series456'];

      actions$ = of(action);
      store.select.and.returnValue(of(watchlistWithoutAlbum));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.addItem({ item: albumItem }));
        done();
      });
    });

    it('should handle rapid toggle operations', (done) => {
      const payload = { item: mockItem, action: 'add' as const };
      const action = WatchlistActions.selectItem({ payload });
      const emptyWatchlist: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(emptyWatchlist));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.addItem({ item: mockItem }));

        // Simulate second toggle - item should now be in watchlist
        const payload = { item: mockItem, action: 'remove' as const };
        const toggleAction = WatchlistActions.selectItem({ payload });
        const watchlistWithItem = ['movie123'];

        actions$ = of(toggleAction);
        store.select.and.returnValue(of(watchlistWithItem));

        effects.itemSelected$.subscribe((toggleResult) => {
          expect(toggleResult).toEqual(WatchlistActions.removeItem({ itemId: mockItem.id }));
          done();
        });
      });
    });
  });
});
