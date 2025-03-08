import * as SearchActions from '../../actions/search.actions';
import * as WatchListActions from '../../actions/watchlist.actions';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectSearchResults, selectWatchlistIds } from '../../reducers';

import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { MediaItem } from '../../shared/models';
import { Observable } from 'rxjs';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search',
  imports: [LayoutComponent, FormComponent, ResultsListComponent, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup | undefined;
  searchResults$: Observable<MediaItem[]> | undefined;

  constructor(private store: Store, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required]],
    });
    this.searchResults$ = this.store.select(selectSearchResults);
  }

  search(): void {
    this.store.dispatch(
      SearchActions.search({ query: this.searchForm?.value.query })
    );
  }

  selectItem(item: MediaItem): void {
    this.store.dispatch(WatchListActions.watchlistSelectItem({ item }));
  }
}
