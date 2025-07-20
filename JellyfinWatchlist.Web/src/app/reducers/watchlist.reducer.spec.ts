import { State, adapter, initialState, watchlistReducer } from './watchlist.reducer';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models';
import { WatchlistActions } from '../actions/watchlist.actions';
import { WatchlistItem } from '../shared/models';

describe('WatchlistReducer', () => {
  const mockItem1: WatchlistItem = {
    id: 'movie1',
    name: 'B Movie',
    mediaType: BaseItemKind.Movie,
    year: 2024,
    primaryImageUrl: 'http://jellyfin.local/movie1.jpg',
    jellyfinUserId: 'user1',
    addedOn: new Date(),
  };

  const mockItem2: WatchlistItem = {
    id: 'series1',
    name: 'A Series',
    mediaType: BaseItemKind.Series,
    year: 2023,
    primaryImageUrl: 'http://jellyfin.local/series1.jpg',
    jellyfinUserId: 'user1',
    addedOn: new Date(),
  };

  const mockItem3: WatchlistItem = {
    id: 'album1',
    name: 'C Album',
    mediaType: BaseItemKind.MusicAlbum,
    year: 2022,
    primaryImageUrl: 'http://jellyfin.local/album1.jpg',
    jellyfinUserId: 'user1',
    addedOn: new Date(),
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = watchlistReducer(undefined, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('addItem action', () => {
    it('should add item to empty watchlist', () => {
      const action = WatchlistActions.addItemSucceeded({ item: mockItem1 });
      const result = watchlistReducer(initialState, action);

      expect(result.ids).toEqual(['movie1']);
      expect(result.entities['movie1']).toEqual(mockItem1);
    });

    it('should add item to existing watchlist', () => {
      const stateWithOneItem = adapter.addOne(mockItem1, initialState);
      const action = WatchlistActions.addItemSucceeded({ item: mockItem2 });
      const result = watchlistReducer(stateWithOneItem, action);

      expect(result.ids).toContain('movie1');
      expect(result.ids).toContain('series1');
      expect(result.entities['movie1']).toEqual(mockItem1);
      expect(result.entities['series1']).toEqual(mockItem2);
    });

    it('should maintain alphabetical sorting by name', () => {
      let currentState = initialState;

      // Add items in non-alphabetical order
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem1 }),
      ); // B Movie
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem3 }),
      ); // C Album
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem2 }),
      ); // A Series

      // Should be sorted alphabetically: A Series, B Movie, C Album
      expect(currentState.ids).toEqual(['series1', 'movie1', 'album1']);
    });

    it('should not add duplicate items', () => {
      const stateWithOneItem = adapter.addOne(mockItem1, initialState);
      const action = WatchlistActions.addItemSucceeded({ item: mockItem1 });
      const result = watchlistReducer(stateWithOneItem, action);

      // Should still only have one item
      expect(result.ids.length).toBe(1);
      expect(result.ids).toEqual(['movie1']);
      expect(result.entities['movie1']).toEqual(mockItem1);
    });

    it('should preserve existing item if added again (EntityAdapter behavior)', () => {
      const stateWithOneItem = adapter.addOne(mockItem1, initialState);
      const updatedItem: WatchlistItem = {
        ...mockItem1,
        name: 'Updated Movie',
        year: 2025,
      };
      const action = WatchlistActions.addItemSucceeded({ item: updatedItem });
      const result = watchlistReducer(stateWithOneItem, action);

      expect(result.ids.length).toBe(1);
      expect(result.entities['movie1']?.name).toBe('B Movie'); // Original name preserved
      expect(result.entities['movie1']?.year).toBe(2024); // Original year preserved
    });
  });

  describe('removeItem action', () => {
    it('should remove item from watchlist', () => {
      const stateWithOneItem = adapter.addOne(mockItem1, initialState);
      const action = WatchlistActions.removeItemSucceeded({ itemId: mockItem1.id });
      const result = watchlistReducer(stateWithOneItem, action);

      expect(result.ids).toEqual([]);
      expect(result.entities['movie1']).toBeUndefined();
    });

    it('should remove specific item from multiple items', () => {
      let stateWithMultipleItems = adapter.addOne(mockItem1, initialState);
      stateWithMultipleItems = adapter.addOne(mockItem2, stateWithMultipleItems);
      stateWithMultipleItems = adapter.addOne(mockItem3, stateWithMultipleItems);

      const action = WatchlistActions.removeItemSucceeded({ itemId: mockItem2.id });
      const result = watchlistReducer(stateWithMultipleItems, action);

      expect(result.ids).toContain('movie1');
      expect(result.ids).toContain('album1');
      expect(result.ids).not.toContain('series1');
      expect(result.entities['series1']).toBeUndefined();
      expect(result.entities['movie1']).toEqual(mockItem1);
      expect(result.entities['album1']).toEqual(mockItem3);
    });

    it('should handle removing non-existent item', () => {
      const stateWithOneItem = adapter.addOne(mockItem1, initialState);
      const action = WatchlistActions.removeItemSucceeded({ itemId: mockItem2.id });
      const result = watchlistReducer(stateWithOneItem, action);

      // State should remain unchanged
      expect(result.ids).toEqual(['movie1']);
      expect(result.entities['movie1']).toEqual(mockItem1);
    });

    it('should handle removing from empty watchlist', () => {
      const action = WatchlistActions.removeItemSucceeded({ itemId: mockItem1.id });
      const result = watchlistReducer(initialState, action);

      expect(result).toEqual(initialState);
    });

    it('should maintain sorting after removal', () => {
      let stateWithMultipleItems = adapter.addOne(mockItem2, initialState); // A Series
      stateWithMultipleItems = adapter.addOne(mockItem1, stateWithMultipleItems); // B Movie
      stateWithMultipleItems = adapter.addOne(mockItem3, stateWithMultipleItems); // C Album

      // Remove middle item (B Movie)
      const action = WatchlistActions.removeItemSucceeded({ itemId: mockItem1.id });
      const result = watchlistReducer(stateWithMultipleItems, action);

      // Should maintain alphabetical order: A Series, C Album
      expect(result.ids).toEqual(['series1', 'album1']);
    });
  });

  describe('clear action', () => {
    it('should clear empty watchlist', () => {
      const action = WatchlistActions.clear();
      const result = watchlistReducer(initialState, action);

      expect(result).toEqual(initialState);
    });

    it('should clear watchlist with one item', () => {
      const stateWithOneItem = adapter.addOne(mockItem1, initialState);
      const action = WatchlistActions.clear();
      const result = watchlistReducer(stateWithOneItem, action);

      expect(result.ids).toEqual([]);
      expect(result.entities).toEqual({});
    });

    it('should clear watchlist with multiple items', () => {
      let stateWithMultipleItems = adapter.addOne(mockItem1, initialState);
      stateWithMultipleItems = adapter.addOne(mockItem2, stateWithMultipleItems);
      stateWithMultipleItems = adapter.addOne(mockItem3, stateWithMultipleItems);

      const action = WatchlistActions.clear();
      const result = watchlistReducer(stateWithMultipleItems, action);

      expect(result.ids).toEqual([]);
      expect(result.entities).toEqual({});
    });
  });

  describe('entity adapter behavior', () => {
    it('should use correct selectId function', () => {
      const action = WatchlistActions.addItemSucceeded({ item: mockItem1 });
      const result = watchlistReducer(initialState, action);

      expect(result.ids[0]).toBe(mockItem1.id);
      expect(result.entities[mockItem1.id]).toEqual(mockItem1);
    });

    it('should sort items alphabetically by name', () => {
      let currentState = initialState;

      // Add items in reverse alphabetical order
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem3 }),
      ); // C Album
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem1 }),
      ); // B Movie
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem2 }),
      ); // A Series

      // Verify alphabetical sorting
      const sortedIds = currentState.ids as string[];
      const sortedNames = sortedIds.map((id) => currentState.entities[id]?.name);
      expect(sortedNames).toEqual(['A Series', 'B Movie', 'C Album']);
    });

    it('should handle case-insensitive sorting', () => {
      const lowerCaseItem: WatchlistItem = {
        id: 'test1',
        name: 'a lowercase item',
        mediaType: BaseItemKind.Movie,
        year: 2024,
        primaryImageUrl: 'http://test.com/test.jpg',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };

      const upperCaseItem: WatchlistItem = {
        id: 'test2',
        name: 'Z UPPERCASE ITEM',
        mediaType: BaseItemKind.Series,
        year: 2024,
        primaryImageUrl: 'http://test.com/test2.jpg',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };

      let currentState = initialState;
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: upperCaseItem }),
      );
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: lowerCaseItem }),
      );

      const sortedIds = currentState.ids as string[];
      const sortedNames = sortedIds.map((id) => currentState.entities[id]?.name);
      expect(sortedNames).toEqual(['a lowercase item', 'Z UPPERCASE ITEM']);
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on addItem', () => {
      const originalState = { ...initialState };
      const action = WatchlistActions.addItemSucceeded({ item: mockItem1 });
      const result = watchlistReducer(initialState, action);

      expect(initialState).toEqual(originalState);
      expect(result).not.toBe(initialState);
    });

    it('should not mutate original state on removeItem', () => {
      const stateWithItem = adapter.addOne(mockItem1, initialState);
      const originalState = { ...stateWithItem };
      const action = WatchlistActions.removeItemSucceeded({ itemId: mockItem1.id });
      const result = watchlistReducer(stateWithItem, action);

      expect(stateWithItem).toEqual(originalState);
      expect(result).not.toBe(stateWithItem);
    });

    it('should not mutate original state on clear', () => {
      const stateWithItems = adapter.addMany([mockItem1, mockItem2], initialState);
      const originalState = { ...stateWithItems };
      const action = WatchlistActions.clear();
      const result = watchlistReducer(stateWithItems, action);

      expect(stateWithItems).toEqual(originalState);
      expect(result).not.toBe(stateWithItems);
    });
  });

  describe('complex scenarios', () => {
    it('should handle rapid add/remove operations', () => {
      let currentState = initialState;

      // Add multiple items
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem1 }),
      );
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem2 }),
      );
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem3 }),
      );
      expect(currentState.ids.length).toBe(3);

      // Remove one
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.removeItemSucceeded({ itemId: mockItem2.id }),
      );
      expect(currentState.ids.length).toBe(2);
      expect(currentState.ids).not.toContain('series1');

      // Add it back
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: mockItem2 }),
      );
      expect(currentState.ids.length).toBe(3);
      expect(currentState.ids).toContain('series1');

      // Clear all
      currentState = watchlistReducer(currentState, WatchlistActions.clear());
      expect(currentState.ids.length).toBe(0);
    });

    it('should handle items with same name but different IDs', () => {
      const item1: WatchlistItem = {
        id: 'item1',
        name: 'Same Name',
        mediaType: BaseItemKind.Movie,
        year: 2024,
        primaryImageUrl: 'http://test.com/1.jpg',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };

      const item2: WatchlistItem = {
        id: 'item2',
        name: 'Same Name',
        mediaType: BaseItemKind.Series,
        year: 2023,
        primaryImageUrl: 'http://test.com/2.jpg',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };

      let currentState = initialState;
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: item1 }),
      );
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.addItemSucceeded({ item: item2 }),
      );

      expect(currentState.ids.length).toBe(2);
      expect(currentState.ids).toContain('item1');
      expect(currentState.ids).toContain('item2');
      expect(currentState.entities['item1']).toEqual(item1);
      expect(currentState.entities['item2']).toEqual(item2);
    });

    it('should handle large number of items', () => {
      const manyItems: WatchlistItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `item${i}`,
        name: `Item ${String(i).padStart(4, '0')}`, // Ensures consistent sorting
        mediaType: BaseItemKind.Movie,
        year: 2020 + (i % 5),
        primaryImageUrl: `http://test.com/item${i}.jpg`,
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      }));

      let currentState = initialState;
      manyItems.forEach((item) => {
        currentState = watchlistReducer(currentState, WatchlistActions.addItemSucceeded({ item }));
      });

      expect(currentState.ids.length).toBe(1000);

      // Verify sorting is maintained
      const sortedIds = currentState.ids as string[];
      const sortedNames = sortedIds.map((id) => currentState.entities[id]?.name);
      const expectedSortedNames = manyItems.map((item) => item.name).sort();
      expect(sortedNames).toEqual(expectedSortedNames);
    });
  });

  describe('loadWatchlist action', () => {
    it('should set loading to true', () => {
      const action = WatchlistActions.loadWatchlist();
      const result = watchlistReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        loading: true,
      });
    });

    it('should set loading to true from populated state', () => {
      const populatedState = {
        ...initialState,
        entities: { [mockItem1.id]: mockItem1 },
        ids: [mockItem1.id],
        loading: false,
      };

      const action = WatchlistActions.loadWatchlist();
      const result = watchlistReducer(populatedState, action);

      expect(result).toEqual({
        ...populatedState,
        loading: true,
      });
    });

    it('should not mutate state', () => {
      const originalState = { ...initialState };
      const action = WatchlistActions.loadWatchlist();
      const result = watchlistReducer(initialState, action);

      expect(initialState).toEqual(originalState);
      expect(result).not.toBe(initialState);
    });
  });

  describe('loadWatchlistSucceeded action', () => {
    it('should set all items and set loading to false', () => {
      const items = [mockItem1, mockItem2];
      const action = WatchlistActions.loadWatchlistSucceeded({ items });
      const result = watchlistReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.ids.length).toBe(2);
      expect(result.entities[mockItem1.id]).toEqual(mockItem1);
      expect(result.entities[mockItem2.id]).toEqual(mockItem2);
    });

    it('should replace existing items with loaded items', () => {
      const existingState = {
        ...initialState,
        entities: { [mockItem3.id]: mockItem3 },
        ids: [mockItem3.id],
        loading: true,
      };

      const newItems = [mockItem1, mockItem2];
      const action = WatchlistActions.loadWatchlistSucceeded({ items: newItems });
      const result = watchlistReducer(existingState, action);

      expect(result.loading).toBe(false);
      expect(result.ids.length).toBe(2);
      expect(result.entities[mockItem1.id]).toEqual(mockItem1);
      expect(result.entities[mockItem2.id]).toEqual(mockItem2);
      expect(result.entities[mockItem3.id]).toBeUndefined();
    });

    it('should handle empty items array', () => {
      const populatedState = {
        ...initialState,
        entities: { [mockItem1.id]: mockItem1 },
        ids: [mockItem1.id],
        loading: true,
      };

      const action = WatchlistActions.loadWatchlistSucceeded({ items: [] });
      const result = watchlistReducer(populatedState, action);

      expect(result.loading).toBe(false);
      expect(result.ids.length).toBe(0);
      expect(Object.keys(result.entities).length).toBe(0);
    });

    it('should maintain alphabetical sorting for loaded items', () => {
      const items = [mockItem3, mockItem1, mockItem2]; // Unordered
      const action = WatchlistActions.loadWatchlistSucceeded({ items });
      const result = watchlistReducer(initialState, action);

      const sortedIds = result.ids as string[];
      const sortedNames = sortedIds.map((id) => result.entities[id]?.name);
      expect(sortedNames).toEqual(['A Series', 'B Movie', 'C Album']);
    });

    it('should not mutate state', () => {
      const loadingState = { ...initialState, loading: true };
      const originalState = { ...loadingState };
      const items = [mockItem1];
      const action = WatchlistActions.loadWatchlistSucceeded({ items });
      const result = watchlistReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
    });
  });

  describe('loadWatchlistFailed action', () => {
    it('should set loading to false', () => {
      const loadingState = { ...initialState, loading: true };
      const action = WatchlistActions.loadWatchlistFailed({ error: 'Network error' });
      const result = watchlistReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.entities).toEqual(loadingState.entities);
      expect(result.ids).toEqual(loadingState.ids);
    });

    it('should preserve existing items on failure', () => {
      const populatedState = {
        ...initialState,
        entities: { [mockItem1.id]: mockItem1, [mockItem2.id]: mockItem2 },
        ids: [mockItem1.id, mockItem2.id],
        loading: true,
      };

      const action = WatchlistActions.loadWatchlistFailed({ error: 'API error' });
      const result = watchlistReducer(populatedState, action);

      expect(result.loading).toBe(false);
      expect(result.entities).toEqual(populatedState.entities);
      expect(result.ids).toEqual(populatedState.ids);
    });

    it('should not mutate state', () => {
      const loadingState = { ...initialState, loading: true };
      const originalState = { ...loadingState };
      const action = WatchlistActions.loadWatchlistFailed({ error: 'Test error' });
      const result = watchlistReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
    });
  });

  describe('loading state management', () => {
    it('should handle load/success cycle', () => {
      let currentState = initialState;

      // Start loading
      currentState = watchlistReducer(currentState, WatchlistActions.loadWatchlist());
      expect(currentState.loading).toBe(true);

      // Success
      const items = [mockItem1, mockItem2];
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.loadWatchlistSucceeded({ items }),
      );
      expect(currentState.loading).toBe(false);
      expect(currentState.ids.length).toBe(2);
    });

    it('should handle load/failure cycle', () => {
      let currentState = initialState;

      // Start loading
      currentState = watchlistReducer(currentState, WatchlistActions.loadWatchlist());
      expect(currentState.loading).toBe(true);

      // Failure
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.loadWatchlistFailed({ error: 'Failed to load' }),
      );
      expect(currentState.loading).toBe(false);
      expect(currentState.ids.length).toBe(0);
    });

    it('should handle multiple load requests', () => {
      let currentState = initialState;

      // First load
      currentState = watchlistReducer(currentState, WatchlistActions.loadWatchlist());
      expect(currentState.loading).toBe(true);

      // Second load while first is in progress
      currentState = watchlistReducer(currentState, WatchlistActions.loadWatchlist());
      expect(currentState.loading).toBe(true);

      // Success should work normally
      const items = [mockItem1];
      currentState = watchlistReducer(
        currentState,
        WatchlistActions.loadWatchlistSucceeded({ items }),
      );
      expect(currentState.loading).toBe(false);
      expect(currentState.ids.length).toBe(1);
    });
  });
});
