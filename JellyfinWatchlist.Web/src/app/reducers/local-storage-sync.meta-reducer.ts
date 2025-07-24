import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export const localStorageSyncReducer = (reducer: ActionReducer<unknown>): ActionReducer<unknown> =>
  localStorageSync({
    keys: ['auth', 'systemInfo', 'currentUser', 'watchlist'],
    rehydrate: true,
    storage: localStorage,
  })(reducer);
