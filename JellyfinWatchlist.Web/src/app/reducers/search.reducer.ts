import * as searchActions from '../actions/search.actions';

import { createFeature, createReducer, on } from '@ngrx/store';

import { SearchResult } from '../pages/search/models';

export interface State {
  results: Array<SearchResult>;
  loading: boolean;
}

export const initialState: State = {
  results: [],
  loading: false,
};

export const searchReducer = createReducer(
  initialState,
  on(searchActions.search, (state) => ({
    ...state,
    loading: true,
  })),
  on(searchActions.searchSucceeded, (state, { results }) => ({
    ...state,
    results,
    loading: false,
  })),
  on(searchActions.searchFailed, (state) => ({
    ...state,
    results: [],
    loading: false,
  }))
);

const searchFeature = createFeature({
  name: 'search',
  reducer: searchReducer,
});

export const {
  name,
  reducer,
  selectSearchState,
  selectResults,
  selectLoading,
} = searchFeature;
