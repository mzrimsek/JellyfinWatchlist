import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { WatchlistActions } from '../actions/watchlist.actions';
import { WatchlistEffects } from './watchlist.effects';
import { provideMockActions } from '@ngrx/effects/testing';

// Mock data
const mockItem = {
  id: 'movie123',
  name: 'Test Movie',
  mediaType: 'Movie' as any,
  year: 2024,
  primaryImageUrl: 'http://jellyfin.local/image.jpg',
  jellyfinUserId: 'user-123',
  addedOn: new Date('2024-01-01'),
};

const mockItem2 = {
  id: 'series456',
  name: 'Test Series',
  mediaType: 'Series' as any,
  year: 2023,
  primaryImageUrl: 'http://jellyfin.local/series.jpg',
  jellyfinUserId: 'user-456',
  addedOn: new Date('2024-01-02'),
};

describe('WatchlistEffects', () => {
  let actions$: Observable<Action>;
  let effects: WatchlistEffects;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select']);

    TestBed.configureTestingModule({
      providers: [
        WatchlistEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: storeSpy },
      ],
    });

    effects = TestBed.inject(WatchlistEffects);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  describe('itemSelected$', () => {
    it('should return WatchlistActions.addItem when item is not in watchlist', (done) => {
      const action = WatchlistActions.selectItem({ item: mockItem });
      const expectedAction = WatchlistActions.addItem({ item: mockItem });
      const existingWatchlistIds = ['series456', 'book789']; // mockItem.id not included

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(store.select).toHaveBeenCalled();
        done();
      });
    });

    it('should return WatchlistActions.removeItem when item is already in watchlist', (done) => {
      const action = WatchlistActions.selectItem({ item: mockItem });
      const expectedAction = WatchlistActions.removeItem({ item: mockItem });
      const existingWatchlistIds = ['movie123', 'series456']; // mockItem.id included

      actions$ = of(action);
      store.select.and.returnValue(of(existingWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(store.select).toHaveBeenCalled();
        done();
      });
    });

    it('should handle empty watchlist', (done) => {
      const action = WatchlistActions.selectItem({ item: mockItem });
      const expectedAction = WatchlistActions.addItem({ item: mockItem });
      const emptyWatchlistIds: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(emptyWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should convert number IDs to strings for comparison', (done) => {
      const numericIdItem = { ...mockItem, id: '123' };
      const action = WatchlistActions.selectItem({ item: numericIdItem });
      const expectedAction = WatchlistActions.removeItem({ item: numericIdItem });
      const numericWatchlistIds = [123, 456]; // Numbers in watchlist

      actions$ = of(action);
      store.select.and.returnValue(of(numericWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle case-sensitive ID matching', (done) => {
      const uppercaseIdItem = { ...mockItem, id: 'MOVIE123' };
      const action = WatchlistActions.selectItem({ item: uppercaseIdItem });
      const expectedAction = WatchlistActions.addItem({ item: uppercaseIdItem });
      const lowercaseWatchlistIds = ['movie123', 'series456'];

      actions$ = of(action);
      store.select.and.returnValue(of(lowercaseWatchlistIds));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should use exhaustMap to prevent multiple concurrent selections', (done) => {
      const action1 = WatchlistActions.selectItem({ item: mockItem });
      const action2 = WatchlistActions.selectItem({ item: mockItem2 });
      const existingWatchlistIds: string[] = [];

      actions$ = of(action1, action2);
      store.select.and.returnValue(of(existingWatchlistIds));

      let emissionCount = 0;
      effects.itemSelected$.subscribe((result) => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(result).toEqual(WatchlistActions.addItem({ item: mockItem }));
        }
        if (emissionCount === 2) {
          expect(result).toEqual(WatchlistActions.addItem({ item: mockItem2 }));
          done();
        }
      });
    });

    it('should handle multiple items with different outcomes', (done) => {
      const action = WatchlistActions.selectItem({ item: mockItem });
      const watchlistWithOneItem = ['series456']; // Only has series456, not movie123

      actions$ = of(action);
      store.select.and.returnValue(of(watchlistWithOneItem));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.addItem({ item: mockItem }));
        done();
      });
    });

    it('should select correct watchlist IDs from store', (done) => {
      const action = WatchlistActions.selectItem({ item: mockItem });
      const watchlistIds = ['movie123'];

      actions$ = of(action);
      store.select.and.returnValue(of(watchlistIds));

      effects.itemSelected$.subscribe(() => {
        expect(store.select).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle adding item to existing watchlist', (done) => {
      const newItem = { ...mockItem, id: 'newMovie999' };
      const action = WatchlistActions.selectItem({ item: newItem });
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
      const action = WatchlistActions.selectItem({ item: existingItem });
      const fullWatchlist = ['movie123', 'series456', 'album789', 'book101'];

      actions$ = of(action);
      store.select.and.returnValue(of(fullWatchlist));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.removeItem({ item: existingItem }));
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
      const action = WatchlistActions.selectItem({ item: albumItem });
      const watchlistWithoutAlbum = ['movie123', 'series456'];

      actions$ = of(action);
      store.select.and.returnValue(of(watchlistWithoutAlbum));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.addItem({ item: albumItem }));
        done();
      });
    });

    it('should handle rapid toggle operations', (done) => {
      const action = WatchlistActions.selectItem({ item: mockItem });
      const emptyWatchlist: string[] = [];

      actions$ = of(action);
      store.select.and.returnValue(of(emptyWatchlist));

      effects.itemSelected$.subscribe((result) => {
        expect(result).toEqual(WatchlistActions.addItem({ item: mockItem }));

        // Simulate second toggle - item should now be in watchlist
        const toggleAction = WatchlistActions.selectItem({ item: mockItem });
        const watchlistWithItem = ['movie123'];

        actions$ = of(toggleAction);
        store.select.and.returnValue(of(watchlistWithItem));

        effects.itemSelected$.subscribe((toggleResult) => {
          expect(toggleResult).toEqual(WatchlistActions.removeItem({ item: mockItem }));
          done();
        });
      });
    });
  });
});
