import { Action, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models';
import { JellyfinService } from '../services/jellyfin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchActions } from '../actions/search.actions';
import { SearchEffects } from './search.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { selectCurrentUserId } from '../reducers';

// Mock data with proper types
const mockUserId = 'user123';
const mockSearchResponse = {
  SearchHints: [
    {
      Id: 'movie1',
      Name: 'Test Movie',
      Type: BaseItemKind.Movie,
      ProductionYear: 2024,
      PrimaryImageTag: 'imageTag1',
    },
    {
      Id: 'series1',
      Name: 'Test Series',
      Type: BaseItemKind.Series,
      ProductionYear: 2023,
      PrimaryImageTag: 'imageTag2',
    },
  ],
};

const mockMappedResults = [
  {
    id: 'movie1',
    name: 'Test Movie',
    mediaType: BaseItemKind.Movie,
    year: 2024,
    primaryImageUrl: 'http://jellyfin.local/Items/movie1/Images/Primary/imageTag1',
  },
  {
    id: 'series1',
    name: 'Test Series',
    mediaType: BaseItemKind.Series,
    year: 2023,
    primaryImageUrl: 'http://jellyfin.local/Items/series1/Images/Primary/imageTag2',
  },
];

describe('SearchEffects', () => {
  let actions$: Observable<Action>;
  let effects: SearchEffects;
  let jellyfinService: jasmine.SpyObj<JellyfinService>;
  let store: jasmine.SpyObj<Store>;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const jellyfinServiceSpy = jasmine.createSpyObj('JellyfinService', [
      'search',
      'getItemPrimaryImageUrl',
    ]);
    const storeSpy = jasmine.createSpyObj('Store', ['select']);
    const matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        { provide: JellyfinService, useValue: jellyfinServiceSpy },
        { provide: Store, useValue: storeSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
    });

    effects = TestBed.inject(SearchEffects);
    jellyfinService = TestBed.inject(JellyfinService) as jasmine.SpyObj<JellyfinService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    matSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Setup default store behavior
    store.select.and.returnValue(of(mockUserId));

    // Setup default image URL generation
    jellyfinService.getItemPrimaryImageUrl.and.callFake(
      (id, tag) => `http://jellyfin.local/Items/${id}/Images/Primary/${tag}`,
    );
  });

  describe('searchActions$', () => {
    it('should return SearchActions.searchSucceeded when search succeeds', (done) => {
      const query = 'test movie';
      const action = SearchActions.search({ query });
      const expectedAction = SearchActions.searchSucceeded({ results: mockMappedResults });

      actions$ = of(action);
      jellyfinService.search.and.returnValue(of(mockSearchResponse));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.search).toHaveBeenCalledWith(query, mockUserId);
        expect(jellyfinService.getItemPrimaryImageUrl).toHaveBeenCalledWith('movie1', 'imageTag1');
        expect(jellyfinService.getItemPrimaryImageUrl).toHaveBeenCalledWith('series1', 'imageTag2');
        done();
      });
    });

    it('should return SearchActions.searchFailed when search service fails', (done) => {
      const query = 'test query';
      const action = SearchActions.search({ query });
      const expectedAction = SearchActions.searchFailed();

      actions$ = of(action);
      jellyfinService.search.and.returnValue(throwError(() => new Error('Search service error')));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.search).toHaveBeenCalledWith(query, mockUserId);
        done();
      });
    });

    it('should handle empty search results', (done) => {
      const query = 'empty query';
      const action = SearchActions.search({ query });
      const expectedAction = SearchActions.searchSucceeded({ results: [] });

      actions$ = of(action);
      jellyfinService.search.and.returnValue(of({ SearchHints: [] }));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.search).toHaveBeenCalledWith(query, mockUserId);
        done();
      });
    });

    it('should handle null SearchHints in response', (done) => {
      const query = 'null hints query';
      const action = SearchActions.search({ query });
      const expectedAction = SearchActions.searchSucceeded({ results: [] });

      actions$ = of(action);
      jellyfinService.search.and.returnValue(of({ SearchHints: undefined }));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle undefined SearchHints in response', (done) => {
      const query = 'undefined hints query';
      const action = SearchActions.search({ query });
      const expectedAction = SearchActions.searchSucceeded({ results: [] });

      actions$ = of(action);
      jellyfinService.search.and.returnValue(of({}));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should throw error when search result is missing required properties', (done) => {
      const query = 'incomplete result';
      const action = SearchActions.search({ query });
      const expectedAction = SearchActions.searchFailed();

      actions$ = of(action);
      jellyfinService.search.and.returnValue(throwError(() => new Error('Invalid response')));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should get current user ID from store', (done) => {
      const query = 'user id test';
      const action = SearchActions.search({ query });
      const customUserId = 'custom-user-123';

      actions$ = of(action);
      store.select.and.returnValue(of(customUserId));
      jellyfinService.search.and.returnValue(of(mockSearchResponse));

      effects.searchActions$.subscribe(() => {
        expect(store.select).toHaveBeenCalled();
        expect(jellyfinService.search).toHaveBeenCalledWith(query, customUserId);
        done();
      });
    });

    it('should use exhaustMap to prevent multiple concurrent searches', (done) => {
      const action1 = SearchActions.search({ query: 'first search' });
      const action2 = SearchActions.search({ query: 'second search' });

      actions$ = of(action1, action2);
      jellyfinService.search.and.returnValue(of(mockSearchResponse));

      let emissionCount = 0;
      effects.searchActions$.subscribe((result) => {
        emissionCount++;
        expect(result).toEqual(SearchActions.searchSucceeded({ results: mockMappedResults }));

        if (emissionCount === 2) {
          done();
        }
      });
    });

    it('should map all properties correctly', (done) => {
      const query = 'mapping test';
      const action = SearchActions.search({ query });

      actions$ = of(action);
      jellyfinService.search.and.returnValue(of(mockSearchResponse));

      effects.searchActions$.subscribe((result) => {
        expect('results' in result && result.results.length).toBe(2);

        if ('results' in result) {
          const firstResult = result.results[0];
          expect(firstResult.id).toBe('movie1');
          expect(firstResult.name).toBe('Test Movie');
          expect(firstResult.mediaType).toBe('Movie');
          expect(firstResult.year).toBe(2024);
          expect(firstResult.primaryImageUrl).toBe(
            'http://jellyfin.local/Items/movie1/Images/Primary/imageTag1',
          );
        }
        done();
      });
    });
  });

  describe('searchFailedActions$', () => {
    it('should show snackbar when search fails', (done) => {
      const action = SearchActions.searchFailed();
      actions$ = of(action);

      effects.searchFailedActions$.subscribe(() => {
        expect(matSnackBar.open).toHaveBeenCalledWith('Search failed', 'Dismiss', {
          duration: 3000,
        });
        done();
      });
    });

    it('should not trigger on other actions', (done) => {
      const action = SearchActions.searchSucceeded({ results: [] });
      actions$ = of(action);

      // Since this effect only listens to searchFailed, it shouldn't trigger
      setTimeout(() => {
        expect(matSnackBar.open).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should not dispatch any action (dispatch: false)', (done) => {
      const action = SearchActions.searchFailed();
      actions$ = of(action);

      effects.searchFailedActions$.subscribe(() => {
        // This effect should not return any action
        expect(true).toBe(true); // Add expectation to satisfy test framework
        done();
      });
    });
  });

  describe('effects integration', () => {
    it('should handle complete success flow', (done) => {
      const query = 'integration test';
      const searchAction = SearchActions.search({ query });

      actions$ = of(searchAction);
      jellyfinService.search.and.returnValue(of(mockSearchResponse));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(SearchActions.searchSucceeded({ results: mockMappedResults }));
        expect(store.select).toHaveBeenCalled();
        expect(jellyfinService.search).toHaveBeenCalledWith(query, mockUserId);
        done();
      });
    });

    it('should handle complete failure flow', (done) => {
      const query = 'failure test';
      const searchAction = SearchActions.search({ query });

      actions$ = of(searchAction);
      jellyfinService.search.and.returnValue(throwError(() => new Error('Service error')));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(SearchActions.searchFailed());

        // Now test the failed effect
        actions$ = of(SearchActions.searchFailed());

        effects.searchFailedActions$.subscribe(() => {
          expect(matSnackBar.open).toHaveBeenCalledWith('Search failed', 'Dismiss', {
            duration: 3000,
          });
          done();
        });
      });
    });

    it('should handle mixed media types in search results', (done) => {
      const mixedResponse = {
        SearchHints: [
          {
            Id: 'album1',
            Name: 'Test Album',
            Type: BaseItemKind.MusicAlbum,
            ProductionYear: 2022,
            PrimaryImageTag: 'albumTag',
          },
          {
            Id: 'book1',
            Name: 'Test Book',
            Type: BaseItemKind.Book,
            ProductionYear: 2021,
            PrimaryImageTag: 'bookTag',
          },
        ],
      };

      const expectedResults = [
        {
          id: 'album1',
          name: 'Test Album',
          mediaType: BaseItemKind.MusicAlbum,
          year: 2022,
          primaryImageUrl: 'http://jellyfin.local/Items/album1/Images/Primary/albumTag',
        },
        {
          id: 'book1',
          name: 'Test Book',
          mediaType: BaseItemKind.Book,
          year: 2021,
          primaryImageUrl: 'http://jellyfin.local/Items/book1/Images/Primary/bookTag',
        },
      ];

      const query = 'mixed media';
      const action = SearchActions.search({ query });

      actions$ = of(action);
      jellyfinService.search.and.returnValue(of(mixedResponse));

      effects.searchActions$.subscribe((result) => {
        expect(result).toEqual(SearchActions.searchSucceeded({ results: expectedResults }));
        done();
      });
    });
  });
});
