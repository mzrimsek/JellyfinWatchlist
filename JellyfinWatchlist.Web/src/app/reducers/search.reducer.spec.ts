/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, initialState, searchReducer } from './search.reducer';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models';
import { SearchActions } from '../actions/search.actions';
import { WatchlistItem } from '../shared/models';

describe('SearchReducer', () => {
  const mockResults: WatchlistItem[] = [
    {
      id: 'movie1',
      name: 'Test Movie',
      mediaType: BaseItemKind.Movie,
      year: 2024,
      primaryImageUrl: 'http://jellyfin.local/movie1.jpg',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    },
    {
      id: 'series1',
      name: 'Test Series',
      mediaType: BaseItemKind.Series,
      year: 2023,
      primaryImageUrl: 'http://jellyfin.local/series1.jpg',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    },
  ];

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = searchReducer(undefined, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('search action', () => {
    it('should set loading to true and maintain results', () => {
      const action = SearchActions.search({ query: 'test query' });
      const result = searchReducer(initialState, action);

      expect(result).toEqual({
        results: [],
        loading: true,
      });
    });

    it('should set loading to true from populated state', () => {
      const populatedState: State = {
        results: mockResults,
        loading: false,
      };
      const action = SearchActions.search({ query: 'another query' });
      const result = searchReducer(populatedState, action);

      expect(result).toEqual({
        results: mockResults,
        loading: true,
      });
    });

    it('should handle search when already loading', () => {
      const loadingState: State = {
        results: mockResults,
        loading: true,
      };
      const action = SearchActions.search({ query: 'new query' });
      const result = searchReducer(loadingState, action);

      expect(result).toEqual({
        results: mockResults,
        loading: true,
      });
    });
  });

  describe('searchSucceeded action', () => {
    it('should set results and set loading to false', () => {
      const loadingState: State = {
        results: [],
        loading: true,
      };
      const action = SearchActions.searchSucceeded({ results: mockResults });
      const result = searchReducer(loadingState, action);

      expect(result).toEqual({
        results: mockResults,
        loading: false,
      });
    });

    it('should replace existing results', () => {
      const differentResults: WatchlistItem[] = [
        {
          id: 'album1',
          name: 'Test Album',
          mediaType: BaseItemKind.MusicAlbum,
          year: 2022,
          primaryImageUrl: 'http://jellyfin.local/album1.jpg',
          jellyfinUserId: 'user1',
          addedOn: new Date(),
        },
      ];
      const existingResultsState: State = {
        results: mockResults,
        loading: true,
      };
      const action = SearchActions.searchSucceeded({ results: differentResults });
      const result = searchReducer(existingResultsState, action);

      expect(result).toEqual({
        results: differentResults,
        loading: false,
      });
      expect(result.results.length).toBe(1);
      expect(result.results[0].id).toBe('album1');
    });

    it('should handle empty results', () => {
      const loadingState: State = {
        results: mockResults,
        loading: true,
      };
      const action = SearchActions.searchSucceeded({ results: [] });
      const result = searchReducer(loadingState, action);

      expect(result).toEqual({
        results: [],
        loading: false,
      });
    });

    it('should handle searchSucceeded when not loading', () => {
      const notLoadingState: State = {
        results: [],
        loading: false,
      };
      const action = SearchActions.searchSucceeded({ results: mockResults });
      const result = searchReducer(notLoadingState, action);

      expect(result).toEqual({
        results: mockResults,
        loading: false,
      });
    });

    it('should handle large result sets', () => {
      const largeResults: WatchlistItem[] = Array.from({ length: 100 }, (_, i) => ({
        id: `item${i}`,
        name: `Item ${i}`,
        mediaType: BaseItemKind.Movie,
        year: 2020 + (i % 5),
        primaryImageUrl: `http://jellyfin.local/item${i}.jpg`,
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      }));
      const loadingState: State = {
        results: [],
        loading: true,
      };
      const action = SearchActions.searchSucceeded({ results: largeResults });
      const result = searchReducer(loadingState, action);

      expect(result).toEqual({
        results: largeResults,
        loading: false,
      });
      expect(result.results.length).toBe(100);
    });
  });

  describe('searchFailed action', () => {
    it('should clear results and set loading to false', () => {
      const loadingState: State = {
        results: mockResults,
        loading: true,
      };
      const action = SearchActions.searchFailed();
      const result = searchReducer(loadingState, action);

      expect(result).toEqual({
        results: [],
        loading: false,
      });
    });

    it('should clear results when not loading', () => {
      const notLoadingState: State = {
        results: mockResults,
        loading: false,
      };
      const action = SearchActions.searchFailed();
      const result = searchReducer(notLoadingState, action);

      expect(result).toEqual({
        results: [],
        loading: false,
      });
    });

    it('should handle searchFailed from initial state', () => {
      const action = SearchActions.searchFailed();
      const result = searchReducer(initialState, action);

      expect(result).toEqual({
        results: [],
        loading: false,
      });
    });
  });

  describe('clear action', () => {
    it('should clear results and maintain loading state', () => {
      const populatedState: State = {
        results: mockResults,
        loading: false,
      };
      const action = SearchActions.clear();
      const result = searchReducer(populatedState, action);

      expect(result).toEqual({
        results: [],
        loading: false,
      });
    });

    it('should clear results while loading', () => {
      const loadingState: State = {
        results: mockResults,
        loading: true,
      };
      const action = SearchActions.clear();
      const result = searchReducer(loadingState, action);

      expect(result).toEqual({
        results: [],
        loading: true,
      });
    });

    it('should handle clear from initial state', () => {
      const action = SearchActions.clear();
      const result = searchReducer(initialState, action);

      expect(result).toEqual({
        results: [],
        loading: false,
      });
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on search', () => {
      const originalState = { ...initialState };
      const action = SearchActions.search({ query: 'test' });
      const result = searchReducer(initialState, action);

      expect(initialState).toEqual(originalState);
      expect(result).not.toBe(initialState);
    });

    it('should not mutate original state on searchSucceeded', () => {
      const loadingState: State = {
        results: [],
        loading: true,
      };
      const originalState = { ...loadingState };
      const action = SearchActions.searchSucceeded({ results: mockResults });
      const result = searchReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
      expect(result.results).toBe(mockResults); // Should reference the same results array
    });

    it('should not mutate original state on searchFailed', () => {
      const populatedState: State = {
        results: mockResults,
        loading: true,
      };
      const originalState = { ...populatedState };
      const action = SearchActions.searchFailed();
      const result = searchReducer(populatedState, action);

      expect(populatedState).toEqual(originalState);
      expect(result).not.toBe(populatedState);
    });

    it('should not mutate original state on clear', () => {
      const populatedState: State = {
        results: mockResults,
        loading: false,
      };
      const originalState = { ...populatedState };
      const action = SearchActions.clear();
      const result = searchReducer(populatedState, action);

      expect(populatedState).toEqual(originalState);
      expect(result).not.toBe(populatedState);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined results in searchSucceeded', () => {
      const loadingState: State = {
        results: mockResults,
        loading: true,
      };
      const action = SearchActions.searchSucceeded({ results: undefined as any });
      const result = searchReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.results).toBeUndefined();
    });

    it('should handle duplicate search actions', () => {
      const state1 = searchReducer(initialState, SearchActions.search({ query: 'test' }));
      const state2 = searchReducer(state1, SearchActions.search({ query: 'test again' }));

      expect(state1.loading).toBe(true);
      expect(state2.loading).toBe(true);
      expect(state1).not.toBe(state2);
    });

    it('should handle rapid state changes', () => {
      let currentState = initialState;

      // Start search
      currentState = searchReducer(currentState, SearchActions.search({ query: 'test' }));
      expect(currentState.loading).toBe(true);

      // Search succeeds
      currentState = searchReducer(
        currentState,
        SearchActions.searchSucceeded({ results: mockResults }),
      );
      expect(currentState.loading).toBe(false);
      expect(currentState.results.length).toBe(2);

      // Start new search
      currentState = searchReducer(currentState, SearchActions.search({ query: 'new test' }));
      expect(currentState.loading).toBe(true);
      expect(currentState.results.length).toBe(2); // Previous results maintained

      // New search fails
      currentState = searchReducer(currentState, SearchActions.searchFailed());
      expect(currentState.loading).toBe(false);
      expect(currentState.results.length).toBe(0);
    });
  });
});
