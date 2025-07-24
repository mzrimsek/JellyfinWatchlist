import { Component, OnInit, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../shared/models';

import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { MediaItemListComponent } from '../../shared/components/media-item-list/media-item-list.component';
import { Store } from '@ngrx/store';
import { WatchlistActions } from '../../actions/watchlist.actions';
import { selectAllWatchlist } from '../../reducers';
import { selectCurrentUserName } from '../../reducers';

@Component({
  selector: 'app-home',
  imports: [LayoutComponent, CommonModule, MediaItemListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private store = inject(Store);

  username$: Observable<string> | undefined;
  watchlistItems$: Observable<WatchlistItem[]> | undefined;
  watchlistIds$: Observable<string[]> | undefined;
  watchlistHeader$: Observable<string> | undefined;

  ngOnInit(): void {
    this.store.dispatch(WatchlistActions.loadWatchlist());

    this.username$ = this.store.select(selectCurrentUserName);
    this.watchlistItems$ = this.store.select(selectAllWatchlist);
    this.watchlistIds$ = this.watchlistItems$.pipe(map((items) => items.map((item) => item.id)));
    this.watchlistHeader$ = this.watchlistItems$.pipe(
      map((items) =>
        items.length > 0 ? `Your Watchlist (${items.length})` : 'Your Watchlist is empty',
      ),
    );
  }

  removeItem(payload: SelectWatchlistItemPayload): void {
    if (payload.action === 'remove') {
      // by virtue of it being in the watchlist this should always be 'remove'
      this.store.dispatch(WatchlistActions.removeItem({ itemId: payload.item.id }));
    }
  }
}
