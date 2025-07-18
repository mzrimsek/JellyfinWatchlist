import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { ActivatedRoute } from '@angular/router';
import { AuthActions } from '../../../actions/auth.actions';
import { HeaderComponent } from './header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let store: jasmine.SpyObj<Store>;

  const createComponent = createComponentFactory({
    component: HeaderComponent,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, NoopAnimationsModule],
    providers: [
      mockProvider(Store, {
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

  it('should render header content', () => {
    spectator.detectChanges();
    expect(spectator.element).toBeTruthy();
  });

  it('should dispatch logout action when logout is called', () => {
    spectator.component.logout();

    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
  });

  it('should render toolbar', () => {
    spectator.detectChanges();
    const toolbar = spectator.query('mat-toolbar');
    expect(toolbar).toBeTruthy();
  });
});
