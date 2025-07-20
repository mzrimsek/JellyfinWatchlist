import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { WatchlistItem } from '../../shared/models';
import { selectAllWatchlist } from '../../reducers';
import { selectCurrentUserName } from '../../reducers';

@Component({
  selector: 'app-home',
  imports: [LayoutComponent, CommonModule, WatchlistComponent],
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
}
