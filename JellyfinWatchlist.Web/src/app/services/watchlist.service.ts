import { AddWatchlistItem, WatchlistItem } from '../shared/models';
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private controllerUrl = `${environment.watchlist.baseUrl}/watchlist`;
  private httpClient = inject(HttpClient);

  getWatchlist(userId: string) {
    return this.httpClient.get<WatchlistItem[]>(`${this.controllerUrl}/${userId}`);
  }

  addWatchlistItem(userId: string, item: AddWatchlistItem) {
    return this.httpClient.post<WatchlistItem>(`${this.controllerUrl}/${userId}`, item);
  }

  removeWatchlistItem(userId: string, itemId: string) {
    return this.httpClient.delete(`${this.controllerUrl}/${userId}/${itemId}`);
  }
}
