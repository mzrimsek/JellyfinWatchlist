import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { selectCurrentUserName } from '../../reducers';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
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
    shallow: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should select watchlist from store', () => {
    spectator.detectChanges();
    expect(store.select).toHaveBeenCalled();
  });
});
