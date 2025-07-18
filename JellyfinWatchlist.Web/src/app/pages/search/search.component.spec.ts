import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let spectator: Spectator<SearchComponent>;
  let component: SearchComponent;

  const createComponent = createComponentFactory({
    component: SearchComponent,
    providers: [
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.returnValue(of([])),
        dispatch: jasmine.createSpy('dispatch'),
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

  it('should select search results from store', () => {
    spectator.detectChanges();
    const store = spectator.inject(Store);
    expect(store.select).toHaveBeenCalled();
  });
});
