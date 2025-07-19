import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MediaItemComponent } from './media-item.component';
import { WatchlistItem } from '../../models';

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
    };
    spectator.setInput('item', mockItem);

    let emittedItem: WatchlistItem | undefined;
    spectator.output('itemSelected').subscribe((item) => (emittedItem = item));

    component.selectItem();

    expect(emittedItem).toEqual(mockItem);
  });
});
