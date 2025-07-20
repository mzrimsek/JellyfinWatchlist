import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../shared/models';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { SearchActions } from '../../actions/search.actions';
import { SearchComponent } from './search.component';
import { Store } from '@ngrx/store';
import { WatchlistActions } from '../../actions/watchlist.actions';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let spectator: Spectator<SearchComponent>;
  let component: SearchComponent;
  let store: jasmine.SpyObj<Store>;

  const mockSearchResults: WatchlistItem[] = [
    {
      id: '1',
      name: 'Test Movie',
      year: 2023,
      mediaType: 'Movie',
      primaryImageUrl: '',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    },
    {
      id: '2',
      name: 'Test Show',
      year: 2022,
      mediaType: 'Series',
      primaryImageUrl: '',
      jellyfinUserId: 'user1',
      addedOn: new Date(),
    },
  ];

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [CommonModule, ReactiveFormsModule],
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
    mocks: [LayoutComponent, FormComponent, ResultsListComponent],
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
    it('should initialize search form with required validator', () => {
      spectator.detectChanges();

      expect(component.searchForm).toBeDefined();
      expect(component.searchForm?.get('query')?.hasError('required')).toBe(true);

      component.searchForm?.patchValue({ query: 'test' });
      expect(component.searchForm?.valid).toBe(true);
    });

    it('should select search results from store', () => {
      store.select.and.returnValue(of(mockSearchResults));
      spectator.detectChanges();

      expect(store.select).toHaveBeenCalled();
      component.searchResults$?.subscribe((results) => {
        expect(results).toEqual(mockSearchResults);
      });
    });

    it('should select watchlist ids from store and map to strings', () => {
      const mockIds = [1, 2, 3];
      store.select.and.returnValue(of(mockIds));
      spectator.detectChanges();

      component.watchlistIds$?.subscribe((ids) => {
        expect(ids).toEqual(['1', '2', '3']);
      });
    });
  });

  describe('search', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should dispatch search action with form query value', () => {
      const query = 'test movie';
      component.searchForm?.patchValue({ query });

      component.search();

      expect(store.dispatch).toHaveBeenCalledWith(SearchActions.search({ query }));
    });

    it('should handle empty query', () => {
      component.searchForm?.patchValue({ query: '' });

      component.search();

      expect(store.dispatch).toHaveBeenCalledWith(SearchActions.search({ query: '' }));
    });
  });

  describe('selectItem', () => {
    it('should dispatch selectItem action with the provided payload', () => {
      const item: WatchlistItem = {
        id: '1',
        name: 'Test Movie',
        year: 2023,
        mediaType: 'Movie',
        primaryImageUrl: '',
        jellyfinUserId: 'user1',
        addedOn: new Date(),
      };
      const payload: SelectWatchlistItemPayload = { item, action: 'add' };
      component.selectItem(payload);
      expect(store.dispatch).toHaveBeenCalledWith(WatchlistActions.selectItem({ payload }));
    });
  });
  describe('template integration', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should render layout component', () => {
      expect(spectator.query(LayoutComponent)).toBeTruthy();
    });

    it('should render search form when searchForm is initialized', () => {
      expect(spectator.query(FormComponent)).toBeTruthy();
      const formComponent = spectator.query(FormComponent);
      expect(formComponent!.group).toBe(component.searchForm!);
    });

    it('should render results list with correct inputs', () => {
      const resultsComponent = spectator.query(ResultsListComponent);
      expect(resultsComponent).toBeTruthy();
    });

    it('should handle search event from form component', () => {
      spyOn(component, 'search');
      const formComponent = spectator.query(FormComponent);

      formComponent!.search.emit();

      expect(component.search).toHaveBeenCalled();
    });

    it('should handle itemSelected event from results list', () => {
      spyOn(component, 'selectItem');
      const resultsComponent = spectator.query(ResultsListComponent);
      const testPayload: SelectWatchlistItemPayload = {
        item: {
          id: '1',
          name: 'Test',
          year: 2023,
          mediaType: 'Movie',
          primaryImageUrl: '',
          jellyfinUserId: 'user1',
          addedOn: new Date(),
        },
        action: 'add',
      };

      resultsComponent!.itemSelected.emit(testPayload);

      expect(component.selectItem).toHaveBeenCalledWith(testPayload);
    });
  });
});
