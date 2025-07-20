import { SelectWatchlistItemPayload, WatchlistItem } from '../../shared/models';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { MediaItemListComponent } from '../../shared/components/media-item-list/media-item-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { WatchlistActions } from '../../actions/watchlist.actions';
import { of } from 'rxjs';
import { selectCurrentUserName, selectAllWatchlist } from '../../reducers';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let component: HomeComponent;
  let store: jasmine.SpyObj<Store>;

  const mockWatchlistItems: WatchlistItem[] = [
    {
      id: '1',
      name: 'Test Movie',
      year: 2023,
      mediaType: 'Movie',
      primaryImageUrl: '',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    },
    {
      id: '2',
      name: 'Test Show',
      year: 2022,
      mediaType: 'Series',
      primaryImageUrl: '',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    },
  ];

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [NoopAnimationsModule],
    providers: [
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.callFake((selector: any) => {
          if (
            selector === selectCurrentUserName ||
            selector.toString().includes('selectCurrentUserName')
          ) {
            return of('Test User');
          }
          if (
            selector === selectAllWatchlist ||
            selector.toString().includes('selectAllWatchlist')
          ) {
            return of(mockWatchlistItems);
          }
          // Default fallback for any other selectors
          return of([]);
        }),
        dispatch: jasmine.createSpy('dispatch'),
      }),
      mockProvider(ActivatedRoute, {
        params: of({}),
        queryParams: of({}),
        snapshot: { params: {}, queryParams: {} },
      }),
    ],
    mocks: [LayoutComponent, MediaItemListComponent],
    shallow: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should select current user name from store', () => {
      spectator.detectChanges();

      expect(store.select).toHaveBeenCalled();
      expect(component.username$).toBeDefined();
    });

    it('should receive username from store observable', () => {
      const testUsername = 'John Doe';
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of(testUsername);
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of(mockWatchlistItems);
        }
        return of([]);
      });

      spectator.detectChanges();

      component.username$?.subscribe((username) => {
        expect(username).toBe(testUsername);
      });
    });

    it('should select watchlist from store', () => {
      spectator.detectChanges();

      expect(store.select).toHaveBeenCalled();
      expect(component.watchlistItems$).toBeDefined();
    });

    it('should receive watchlist from store observable', () => {
      const testWatchlist = [
        {
          id: '1',
          name: 'Test Item',
          mediaType: 'Movie',
          year: 2024,
          primaryImageUrl: 'http://example.com/image.jpg',
          jellyfinUserId: 'user-123',
          addedOn: new Date(),
        },
      ];
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of('Test User');
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of(testWatchlist);
        }
        return of([]);
      });

      spectator.detectChanges();

      component.watchlistItems$?.subscribe((watchlist) => {
        expect(watchlist).toEqual(testWatchlist);
      });
    });

    it('should create watchlistIds$ from watchlist items', () => {
      // Set up store to return specific test data
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of('Test User');
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of(mockWatchlistItems);
        }
        return of([]);
      });

      spectator.detectChanges();

      component.watchlistIds$?.subscribe((ids) => {
        expect(ids).toEqual(['1', '2']);
      });
    });

    it('should create watchlistHeader$ with item count', () => {
      // Set up store to return specific test data
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of('Test User');
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of(mockWatchlistItems);
        }
        return of([]);
      });

      spectator.detectChanges();

      component.watchlistHeader$?.subscribe((header) => {
        expect(header).toBe('Your Watchlist (2)');
      });
    });

    it('should create empty watchlist header when no items', () => {
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of('Test User');
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of([]);
        }
        return of([]);
      });

      spectator.detectChanges();

      component.watchlistHeader$?.subscribe((header) => {
        expect(header).toBe('Your Watchlist is empty');
      });
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      store.dispatch.calls.reset();
    });

    it('should dispatch removeItem action when action is remove', () => {
      const mockItem: WatchlistItem = {
        id: '123',
        name: 'Test Movie',
        mediaType: 'Movie',
        year: 2024,
        primaryImageUrl: 'http://example.com/image.jpg',
        jellyfinUserId: 'user-123',
        addedOn: new Date(),
      };
      const payload: SelectWatchlistItemPayload = {
        item: mockItem,
        action: 'remove',
      };

      component.removeItem(payload);

      expect(store.dispatch).toHaveBeenCalledWith(
        WatchlistActions.removeItem({ itemId: mockItem.id }),
      );
    });

    it('should not dispatch action when action is add', () => {
      const mockItem: WatchlistItem = {
        id: '123',
        name: 'Test Movie',
        mediaType: 'Movie',
        year: 2024,
        primaryImageUrl: 'http://example.com/image.jpg',
        jellyfinUserId: 'user-123',
        addedOn: new Date(),
      };
      const payload: SelectWatchlistItemPayload = {
        item: mockItem,
        action: 'add',
      };

      component.removeItem(payload);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should render layout component', () => {
      expect(spectator.query(LayoutComponent)).toBeTruthy();
    });

    it('should render welcome message with username', () => {
      const testUsername = 'Jane Smith';
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of(testUsername);
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of(mockWatchlistItems);
        }
        return of([]);
      });
      component.ngOnInit();
      spectator.detectChanges();

      expect(spectator.query('h1')).toContainText(`Welcome ${testUsername}!`);
    });

    it('should render media item list component', () => {
      spectator.detectChanges();

      const mediaItemList = spectator.query(MediaItemListComponent);
      if (mediaItemList) {
        expect(mediaItemList).toExist();
      } else {
        // For shallow rendering, check the element exists in template
        expect(spectator.query('app-shared-media-item-list')).toExist();
      }
    });

    it('should handle empty username gracefully', () => {
      store.select.and.callFake((selector: any) => {
        if (
          selector === selectCurrentUserName ||
          selector.toString().includes('selectCurrentUserName')
        ) {
          return of('');
        }
        if (selector === selectAllWatchlist || selector.toString().includes('selectAllWatchlist')) {
          return of(mockWatchlistItems);
        }
        return of([]);
      });
      component.ngOnInit();
      spectator.detectChanges();

      expect(spectator.query('h1')).toContainText('Welcome !');
    });
  });
});
