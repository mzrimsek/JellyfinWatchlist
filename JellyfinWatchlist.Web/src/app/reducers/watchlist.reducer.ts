import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { MediaItem } from '../shared/models';
import { WatchlistActions } from '../actions/watchlist.actions';

export interface State extends EntityState<MediaItem> {}

export function selectMediaItemId(item: MediaItem): string {
  return item.id;
}

export function sortByName(a: MediaItem, b: MediaItem): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<MediaItem> = createEntityAdapter<MediaItem>(
  {
    selectId: selectMediaItemId,
    sortComparer: sortByName,
  }
);

export const initialState: State = adapter.getInitialState();

export const watchlistReducer = createReducer(
  initialState,
  on(WatchlistActions.addItem, (state, { item }) =>
    adapter.addOne(item, state)
  ),
  on(WatchlistActions.removeItem, (state, { item }) =>
    adapter.removeOne(item.id, state)
  ),
  on(WatchlistActions.clear, (state) => adapter.removeAll(state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();

export const selectWatchlistIds = selectIds;
export const selectWatchlistEntities = selectEntities;
export const selectAllWatchlist = selectAll;
export const selectWatchlistTotal = selectTotal;
