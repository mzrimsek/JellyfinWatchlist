import { createComponentFactory, Spectator, mockProvider } from '@ngneat/spectator';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from '../header/header.component';

describe('LayoutComponent', () => {
  let spectator: Spectator<LayoutComponent>;

  const createComponent = createComponentFactory({
    component: LayoutComponent,
    imports: [NoopAnimationsModule],
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
    shallow: true, // This will mock the HeaderComponent automatically
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render layout structure', () => {
    spectator.detectChanges();
    expect(spectator.element).toBeTruthy();
  });

  it('should include header component', () => {
    spectator.detectChanges();
    const header = spectator.query('app-shared-header');
    expect(header).toBeTruthy();
  });

  it('should provide content projection slot', () => {
    spectator.detectChanges();
    const contentSlot = spectator.query('ng-content');
    expect(contentSlot).toBeTruthy();
  });
});
