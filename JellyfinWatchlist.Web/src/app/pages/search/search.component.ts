import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../shared/models';
import { selectSearchResults, selectWatchlistIds } from '../../reducers';

import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { MediaItemListComponent } from '../../shared/components/media-item-list/media-item-list.component';
import { SearchActions } from '../../actions/search.actions';
import { Store } from '@ngrx/store';
import { WatchlistActions } from '../../actions/watchlist.actions';

@Component({
  selector: 'app-search',
  imports: [LayoutComponent, FormComponent, CommonModule, MediaItemListComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup | undefined;
  searchResults$: Observable<WatchlistItem[]> | undefined;
  watchlistIds$: Observable<string[]> | undefined;

  constructor(
    private store: Store,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required]],
    });
    this.searchResults$ = this.store.select(selectSearchResults);
    this.watchlistIds$ = this.store
      .select(selectWatchlistIds)
      .pipe(map((ids) => ids.map((id) => id.toString())));
  }

  search(): void {
    this.store.dispatch(SearchActions.search({ query: this.searchForm?.value.query }));
  }

  selectItem(payload: SelectWatchlistItemPayload): void {
    this.store.dispatch(WatchlistActions.selectItem({ payload }));
  }
}
