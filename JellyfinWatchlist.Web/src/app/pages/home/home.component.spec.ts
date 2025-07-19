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
  let component: HomeComponent;
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
    mocks: [LayoutComponent],
    shallow: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should select current user name from store', () => {
      spectator.detectChanges();

      expect(store.select).toHaveBeenCalled();
      expect(component.username$).toBeDefined();
    });

    it('should receive username from store observable', () => {
      const testUsername = 'John Doe';
      store.select.and.returnValue(of(testUsername));

      spectator.detectChanges();

      component.username$?.subscribe((username) => {
        expect(username).toBe(testUsername);
      });
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should render layout component', () => {
      expect(spectator.query(LayoutComponent)).toBeTruthy();
    });

    it('should render welcome message with username', () => {
      const testUsername = 'Jane Smith';
      store.select.and.returnValue(of(testUsername));
      component.ngOnInit();
      spectator.detectChanges();

      expect(spectator.query('h1')).toContainText(`Welcome ${testUsername}!`);
    });

    it('should render TODO section', () => {
      expect(spectator.query('h2')).toContainText('TODO');
      expect(spectator.query('ol')).toExist();
      expect(spectator.queryAll('li')).toHaveLength(2);
      expect(spectator.queryAll('li')[0]).toContainText('Persist watch list');
      expect(spectator.queryAll('li')[1]).toContainText('Display watch list on home page');
    });

    it('should handle empty username gracefully', () => {
      store.select.and.returnValue(of(''));
      component.ngOnInit();
      spectator.detectChanges();

      expect(spectator.query('h1')).toContainText('Welcome !');
    });
  });
});
