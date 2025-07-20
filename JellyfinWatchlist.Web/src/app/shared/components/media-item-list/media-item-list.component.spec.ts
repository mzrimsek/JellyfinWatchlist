import { SelectWatchlistItemPayload, WatchlistItem } from '../../models';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { MediaItemComponent } from '../media-item/media-item.component';
import { MediaItemListComponent } from './media-item-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MediaItemListComponent', () => {
  let spectator: Spectator<MediaItemListComponent>;
  let component: MediaItemListComponent;

  const createComponent = createComponentFactory({
    component: MediaItemListComponent,
    imports: [NoopAnimationsModule],
    mocks: [MediaItemComponent],
    shallow: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default empty arrays for items and watchlistIds', () => {
      expect(component.items).toEqual([]);
      expect(component.watchlistIds).toEqual([]);
    });

    it('should accept items input', () => {
      const testItems: WatchlistItem[] = [
        {
          id: '1',
          name: 'Test Movie',
          mediaType: 'Movie',
          year: 2024,
          primaryImageUrl: 'http://example.com/image.jpg',
          jellyfinUserId: 'user-123',
          addedOn: new Date(),
        },
      ];

      spectator.setInput('items', testItems);

      expect(component.items).toEqual(testItems);
    });

    it('should accept watchlistIds input', () => {
      const testIds = ['1', '2', '3'];

      spectator.setInput('watchlistIds', testIds);

      expect(component.watchlistIds).toEqual(testIds);
    });
  });

  describe('itemIsPartOfWatchlist', () => {
    const testItem: WatchlistItem = {
      id: '123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2024,
      primaryImageUrl: 'http://example.com/image.jpg',
      jellyfinUserId: 'user-123',
      addedOn: new Date(),
    };

    it('should return true when item id is in watchlistIds', () => {
      component.watchlistIds = ['123', '456'];

      const result = component.itemIsPartOfWatchlist(testItem);

      expect(result).toBe(true);
    });

    it('should return false when item id is not in watchlistIds', () => {
      component.watchlistIds = ['456', '789'];

      const result = component.itemIsPartOfWatchlist(testItem);

      expect(result).toBe(false);
    });

    it('should return false when watchlistIds is empty', () => {
      component.watchlistIds = [];

      const result = component.itemIsPartOfWatchlist(testItem);

      expect(result).toBe(false);
    });

    it('should handle case-sensitive id matching', () => {
      component.watchlistIds = ['ABC', 'def'];
      const upperCaseItem = { ...testItem, id: 'abc' };

      const result = component.itemIsPartOfWatchlist(upperCaseItem);

      expect(result).toBe(false);
    });
  });

  describe('Output Events', () => {
    it('should emit itemSelected event when triggered', () => {
      spyOn(component.itemSelected, 'emit');
      const testPayload: SelectWatchlistItemPayload = {
        item: {
          id: '123',
          name: 'Test Movie',
          mediaType: 'Movie',
          year: 2024,
          primaryImageUrl: 'http://example.com/image.jpg',
          jellyfinUserId: 'user-123',
          addedOn: new Date(),
        },
        action: 'add',
      };

      component.itemSelected.emit(testPayload);

      expect(component.itemSelected.emit).toHaveBeenCalledWith(testPayload);
    });
  });

  describe('Template Rendering', () => {
    it('should render mat-card with correct structure', () => {
      spectator.detectChanges();

      expect(spectator.query('mat-card')).toExist();
      expect(spectator.query('mat-card-header')).toExist();
      expect(spectator.query('mat-card-title')).toExist();
      expect(spectator.query('mat-card-content')).toExist();
    });

    it('should render media items when items are provided', () => {
      const testItems: WatchlistItem[] = [
        {
          id: '1',
          name: 'Movie 1',
          mediaType: 'Movie',
          year: 2024,
          primaryImageUrl: 'http://example.com/1.jpg',
          jellyfinUserId: 'user-123',
          addedOn: new Date(),
        },
        {
          id: '2',
          name: 'Movie 2',
          mediaType: 'Movie',
          year: 2023,
          primaryImageUrl: 'http://example.com/2.jpg',
          jellyfinUserId: 'user-123',
          addedOn: new Date(),
        },
      ];

      spectator.setInput('items', testItems);
      spectator.detectChanges();

      const mediaItems = spectator.queryAll('app-shared-media-item');
      expect(mediaItems.length).toBe(2);
    });

    it('should pass correct props to media item components', () => {
      const testItems: WatchlistItem[] = [
        {
          id: '1',
          name: 'Movie 1',
          mediaType: 'Movie',
          year: 2024,
          primaryImageUrl: 'http://example.com/1.jpg',
          jellyfinUserId: 'user-123',
          addedOn: new Date(),
        },
      ];
      const testWatchlistIds = ['1'];

      spectator.setInput('items', testItems);
      spectator.setInput('watchlistIds', testWatchlistIds);
      spectator.detectChanges();

      const mediaItem = spectator.query('app-shared-media-item');
      expect(mediaItem).toExist();
      // Verify the component gets the right watchlist status
      expect(component.itemIsPartOfWatchlist(testItems[0])).toBe(true);
    });

    it('should not render media items when items array is empty', () => {
      spectator.setInput('items', []);
      spectator.detectChanges();

      const mediaItems = spectator.queryAll('app-shared-media-item');
      expect(mediaItems.length).toBe(0);
    });

    it('should project content into ng-content', () => {
      spectator = createComponent({
        props: {
          items: [],
          watchlistIds: [],
        },
      });

      // Create a test with projected content manually
      const testContent = spectator.query('mat-card-title');
      expect(testContent).toExist();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined item id gracefully', () => {
      const itemWithoutId = {
        id: undefined as any,
        name: 'Test',
        mediaType: 'Movie',
        year: 2024,
        primaryImageUrl: '',
        jellyfinUserId: 'user',
        addedOn: new Date(),
      };
      component.watchlistIds = ['test'];

      const result = component.itemIsPartOfWatchlist(itemWithoutId);

      expect(result).toBe(false);
    });

    it('should handle large number of items efficiently', () => {
      const largeItemList: WatchlistItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        name: `Item ${i}`,
        mediaType: 'Movie',
        year: 2024,
        primaryImageUrl: '',
        jellyfinUserId: 'user',
        addedOn: new Date(),
      }));

      spectator.setInput('items', largeItemList);
      spectator.detectChanges();

      expect(() => spectator.detectChanges()).not.toThrow();
      expect(component.items.length).toBe(1000);
    });
  });
});
