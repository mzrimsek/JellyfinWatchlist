import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { HomeComponent } from './home.component';
import { Store } from '@ngrx/store';
import { mockProvider } from '@ngneat/spectator';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let component: HomeComponent;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    providers: [
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.returnValue(of([])),
      }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select watchlist from store', () => {
    spectator.detectChanges();
    const store = spectator.inject(Store);
    expect(store.select).toHaveBeenCalled();
  });
});
