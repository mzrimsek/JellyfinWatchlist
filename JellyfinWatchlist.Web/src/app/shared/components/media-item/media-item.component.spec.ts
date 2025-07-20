import { SelectWatchlistItemPayload, WatchlistItem } from '../../models';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { MediaItemComponent } from './media-item.component';

describe('MediaItemComponent', () => {
  let spectator: Spectator<MediaItemComponent>;
  let component: MediaItemComponent;

  const createComponent = createComponentFactory({
    component: MediaItemComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept item input', () => {
    const mockItem: WatchlistItem = {
      id: '123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2024,
      primaryImageUrl: 'test-url',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    };
    spectator.setInput('item', mockItem);
    spectator.detectChanges();

    expect(component.item).toEqual(mockItem);
  });

  it('should emit itemSelected when selectItem is called', () => {
    const mockItem: WatchlistItem = {
      id: '123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2024,
      primaryImageUrl: 'test-url',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    };
    spectator.setInput('item', mockItem);
    spectator.setInput('isPartOfWatchlist', false);

    let emittedPayload: SelectWatchlistItemPayload | undefined;
    spectator.output('itemSelected').subscribe((payload) => (emittedPayload = payload));

    component.selectItem();

    const expectedPayload: SelectWatchlistItemPayload = {
      item: mockItem,
      action: 'add',
    };
    expect(emittedPayload).toEqual(expectedPayload);
  });

  it('should emit remove action when item is already in watchlist', () => {
    const mockItem: WatchlistItem = {
      id: '123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2024,
      primaryImageUrl: 'test-url',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    };
    spectator.setInput('item', mockItem);
    spectator.setInput('isPartOfWatchlist', true);

    let emittedPayload: SelectWatchlistItemPayload | undefined;
    spectator.output('itemSelected').subscribe((payload) => (emittedPayload = payload));

    component.selectItem();

    const expectedPayload: SelectWatchlistItemPayload = {
      item: mockItem,
      action: 'remove',
    };
    expect(emittedPayload).toEqual(expectedPayload);
  });
});
