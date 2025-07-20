import { WatchlistItem } from './watchlist.models';

export interface SelectWatchlistItemPayload {
  item: WatchlistItem;
  action: 'add' | 'remove';
}
