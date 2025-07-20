import { Component, OnInit } from '@angular/core';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../shared/models';

import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { MediaItemListComponent } from '../../shared/components/media-item-list/media-item-list.component';
import { Observable } from 'rxjs';
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
  username$: Observable<string> | undefined;
  watchlistItems$: Observable<WatchlistItem[]> | undefined;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.username$ = this.store.select(selectCurrentUserName);
    this.watchlistItems$ = this.store.select(selectAllWatchlist);
  }

  removeItem(payload: SelectWatchlistItemPayload): void {
    if (payload.action === 'remove') {
      // by virtue of it being in the watchlist this should always be 'remove'
      this.store.dispatch(WatchlistActions.removeItem({ itemId: payload.item.id }));
    }
  }
}
