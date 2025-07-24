import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import { WatchlistActions } from '../actions/watchlist.actions';
import { WatchlistItem } from '../shared/models';

export interface State extends EntityState<WatchlistItem> {
  loading: boolean;
}

export function selectMediaItemId(item: WatchlistItem): string {
  return item.id;
}

export function sortByName(a: WatchlistItem, b: WatchlistItem): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<WatchlistItem> = createEntityAdapter<WatchlistItem>({
  selectId: selectMediaItemId,
  sortComparer: sortByName,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export const watchlistReducer = createReducer(
  initialState,
  on(WatchlistActions.addItem, (state): State => ({ ...state, loading: true })),
  on(WatchlistActions.addItemSucceeded, (state, { item }): State => {
    return adapter.addOne(item, { ...state, loading: false });
  }),
  on(WatchlistActions.addItemFailed, (state): State => ({ ...state, loading: false })),
  on(WatchlistActions.removeItem, (state): State => ({ ...state, loading: true })),
  on(WatchlistActions.removeItemSucceeded, (state, { itemId }): State => {
    return adapter.removeOne(itemId, { ...state, loading: false });
  }),
  on(WatchlistActions.removeItemFailed, (state): State => ({ ...state, loading: false })),
  on(WatchlistActions.clear, (state): State => adapter.removeAll(state)),
  on(WatchlistActions.loadWatchlist, (state): State => ({ ...state, loading: true })),
  on(WatchlistActions.loadWatchlistSucceeded, (state, { items }): State => {
    return adapter.setAll(items, { ...state, loading: false });
  }),
  on(WatchlistActions.loadWatchlistFailed, (state): State => ({ ...state, loading: false })),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export const selectWatchlistIds = selectIds;
export const selectWatchlistEntities = selectEntities;
export const selectAllWatchlist = selectAll;
export const selectWatchlistTotal = selectTotal;

export const selectWatchlistIdsAsStrings = createSelector(selectWatchlistIds, (ids) =>
  ids.map((id) => id.toString()),
);
