import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

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
});
