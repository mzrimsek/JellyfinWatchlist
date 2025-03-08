import { createFeature, createReducer, on } from '@ngrx/store';

import { MediaItem } from '../shared/models';
import { SearchActions } from '../actions/search.actions';

export interface State {
  results: Array<MediaItem>;
  loading: boolean;
}

export const initialState: State = {
  results: [],
  loading: false,
};

export const searchReducer = createReducer(
  initialState,
  on(SearchActions.search, (state) => ({
    ...state,
    loading: true,
  })),
  on(SearchActions.searchSucceeded, (state, { results }) => ({
    ...state,
    results,
    loading: false,
  })),
  on(SearchActions.searchFailed, (state) => ({
    ...state,
    results: [],
    loading: false,
  })),
  on(SearchActions.clear, (state) => ({
    ...state,
    results: [],
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
