import * as searchActions from '../actions/search.actions';

import { createFeature, createReducer, on } from '@ngrx/store';

import { SearchHintResult } from '@jellyfin/sdk/lib/generated-client/models';

export interface State {
  results: SearchHintResult | null;
  loading: boolean;
}

export const initialState: State = {
  results: null,
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
    results: null,
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
