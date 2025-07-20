import { SelectWatchlistItemPayload, WatchlistItem } from '../../shared/models';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { WatchlistActions } from '../../actions/watchlist.actions';
import { of } from 'rxjs';
import { selectCurrentUserName } from '../../reducers';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let component: HomeComponent;
  let store: jasmine.SpyObj<Store>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [NoopAnimationsModule],
    providers: [
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.returnValue(of('Test User')),
        dispatch: jasmine.createSpy('dispatch'),
      }),
      mockProvider(ActivatedRoute, {
        params: of({}),
        queryParams: of({}),
        snapshot: { params: {}, queryParams: {} },
      }),
    ],
    mocks: [LayoutComponent],
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
      store.select.and.returnValue(of(testUsername));

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
      store.select.and.returnValue(of(testWatchlist));

      spectator.detectChanges();

      component.watchlistItems$?.subscribe((watchlist) => {
        expect(watchlist).toEqual(testWatchlist);
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
      store.select.and.returnValue(of(testUsername));
      component.ngOnInit();
      spectator.detectChanges();

      expect(spectator.query('h1')).toContainText(`Welcome ${testUsername}!`);
    });

    it('should render watchlist component', () => {
      spectator.detectChanges();

      expect(spectator.query('app-home-watchlist')).toExist();
    });

    it('should handle empty username gracefully', () => {
      store.select.and.returnValue(of(''));
      component.ngOnInit();
      spectator.detectChanges();

      expect(spectator.query('h1')).toContainText('Welcome !');
    });
  });
});
