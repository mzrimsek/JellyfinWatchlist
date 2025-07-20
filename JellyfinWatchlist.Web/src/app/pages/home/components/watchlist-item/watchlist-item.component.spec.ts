import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { WatchlistItemComponent } from './watchlist-item.component';

describe('WatchlistItemComponent', () => {
  let spectator: Spectator<WatchlistItemComponent>;
  const createComponent = createComponentFactory({
    component: WatchlistItemComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
