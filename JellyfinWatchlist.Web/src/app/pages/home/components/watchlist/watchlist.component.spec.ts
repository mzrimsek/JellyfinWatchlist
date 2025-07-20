import { SelectWatchlistItemPayload, WatchlistItem } from '../../../../shared/models';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { MediaItemComponent } from '../../../../shared/components/media-item/media-item.component';
import { WatchlistComponent } from './watchlist.component';

describe('WatchlistComponent', () => {
  let spectator: Spectator<WatchlistComponent>;
  let component: WatchlistComponent;

  const mockWatchlistItems: WatchlistItem[] = [
    {
      id: '1',
      name: 'Test Movie 1',
      mediaType: 'Movie',
      year: 2023,
      primaryImageUrl: 'http://example.com/image1.jpg',
      jellyfinUserId: 'user1',
      addedOn: new Date('2023-01-01'),
    },
    {
      id: '2',
      name: 'Test Series 1',
      mediaType: 'Series',
      year: 2022,
      primaryImageUrl: 'http://example.com/image2.jpg',
      jellyfinUserId: 'user1',
      addedOn: new Date('2023-01-02'),
    },
  ];

  const createComponent = createComponentFactory({
    component: WatchlistComponent,
    mocks: [MediaItemComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    it('should accept watchlistItems input', () => {
      spectator.setInput('watchlistItems', mockWatchlistItems);
      expect(component.watchlistItems).toEqual(mockWatchlistItems);
    });

    it('should default to empty array when no watchlistItems provided', () => {
      expect(component.watchlistItems).toEqual([]);
    });

    it('should handle null watchlistItems', () => {
      spectator.setInput('watchlistItems', null);
      expect(component.watchlistItems).toBeNull();
    });
  });

  describe('template rendering', () => {
    it('should show watchlist when items exist', () => {
      spectator.setInput('watchlistItems', mockWatchlistItems);
      spectator.detectChanges();

      expect(spectator.query('h2')).toContainText('Watchlist');
      expect(spectator.query('ul')).toExist();
    });

    it('should show "No items in watchlist" when empty', () => {
      spectator.setInput('watchlistItems', []);
      spectator.detectChanges();

      expect(spectator.query('p')).toContainText('No items in watchlist');
      expect(spectator.query('h2')).not.toExist();
      expect(spectator.query('ul')).not.toExist();
    });

    it('should show "No items in watchlist" when null', () => {
      spectator.setInput('watchlistItems', null);
      spectator.detectChanges();

      expect(spectator.query('p')).toContainText('No items in watchlist');
      expect(spectator.query('h2')).not.toExist();
      expect(spectator.query('ul')).not.toExist();
    });

    it('should render MediaItemComponent for each watchlist item', () => {
      spectator.setInput('watchlistItems', mockWatchlistItems);
      spectator.detectChanges();

      const mediaItems = spectator.queryAll(MediaItemComponent);
      expect(mediaItems).toHaveLength(mockWatchlistItems.length);

      mediaItems.forEach((mediaItem, index) => {
        expect(mediaItem.item).toEqual(mockWatchlistItems[index]);
        expect(mediaItem.isPartOfWatchlist).toBe(true);
      });
    });
  });

  describe('event handling', () => {
    it('should emit itemSelected when MediaItemComponent emits itemSelected', () => {
      spectator.setInput('watchlistItems', mockWatchlistItems);
      spectator.detectChanges();

      spyOn(component.itemSelected, 'emit');

      const mediaItem = spectator.query(MediaItemComponent);
      const testPayload: SelectWatchlistItemPayload = {
        item: mockWatchlistItems[0],
        action: 'remove',
      };

      mediaItem!.itemSelected.emit(testPayload);

      expect(component.itemSelected.emit).toHaveBeenCalledWith(testPayload);
    });

    it('should handle multiple item selections', () => {
      spectator.setInput('watchlistItems', mockWatchlistItems);
      spectator.detectChanges();

      spyOn(component.itemSelected, 'emit');

      const mediaItems = spectator.queryAll(MediaItemComponent);

      const payload1: SelectWatchlistItemPayload = {
        item: mockWatchlistItems[0],
        action: 'remove',
      };
      const payload2: SelectWatchlistItemPayload = {
        item: mockWatchlistItems[1],
        action: 'remove',
      };

      mediaItems[0].itemSelected.emit(payload1);
      mediaItems[1].itemSelected.emit(payload2);

      expect(component.itemSelected.emit).toHaveBeenCalledTimes(2);
      expect(component.itemSelected.emit).toHaveBeenCalledWith(payload1);
      expect(component.itemSelected.emit).toHaveBeenCalledWith(payload2);
    });
  });
});
