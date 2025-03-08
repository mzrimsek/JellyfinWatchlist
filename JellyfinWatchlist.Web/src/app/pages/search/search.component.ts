import * as searchActions from '../../actions/search.actions';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { Observable } from 'rxjs';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { SearchResult } from './models';
import { Store } from '@ngrx/store';
import { selectSearchResults } from '../../reducers';

@Component({
  selector: 'app-search',
  imports: [LayoutComponent, FormComponent, ResultsListComponent, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup | undefined;
  searchResults$: Observable<SearchResult[]> | undefined;

  constructor(private store: Store, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required]],
    });
    this.searchResults$ = this.store.select(selectSearchResults);
  }

  search(): void {
    this.store.dispatch(
      searchActions.search({ query: this.searchForm?.value.query })
    );
  }
}
