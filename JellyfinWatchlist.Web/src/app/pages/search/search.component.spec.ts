import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { SearchComponent } from './search.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { FormComponent } from './components/form/form.component';
import { ResultsListComponent } from './components/results-list/results-list.component';

describe('SearchComponent', () => {
  let spectator: Spectator<SearchComponent>;

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [LayoutComponent, FormComponent, ResultsListComponent],
    providers: [
      FormBuilder,
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.returnValue(of([])),
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
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should select search results from store', () => {
    spectator.detectChanges();
    const store = spectator.inject(Store);
    expect(store.select).toHaveBeenCalled();
  });
});
