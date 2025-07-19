export interface WatchlistItem {
  id: string;
  name: string;
  mediaType: string;
  year: number;
  primaryImageUrl: string;
  jellyfinUserId: string;
  addedOn: Date;
}

export interface AddWatchlistItem {
  id: string;
  name: string;
  mediaType: string;
  year: number;
  primaryImageUrl: string;
}
