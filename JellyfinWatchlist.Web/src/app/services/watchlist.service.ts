import { AddWatchlistItem, WatchlistItem } from '../shared/models';
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private httpClient = inject(HttpClient);
  private configService = inject(ConfigService);

  private get controllerUrl(): string {
    return `${this.configService.watchlistBaseUrl}/watchlist`;
  }

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
