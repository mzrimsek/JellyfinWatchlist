import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { WatchlistComponent } from './watchlist.component';

describe('WatchlistComponent', () => {
  let spectator: Spectator<WatchlistComponent>;
  const createComponent = createComponentFactory({
    component: WatchlistComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
