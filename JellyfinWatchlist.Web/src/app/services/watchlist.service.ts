import { AddWatchlistItem, WatchlistItem } from '../shared/models';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private controllerUrl = `${environment.watchlist.baseUrl}/watchlist`;
  constructor(private readonly httpClient: HttpClient) {}

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
