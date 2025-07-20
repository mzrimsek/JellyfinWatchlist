import { Component, Input } from '@angular/core';

import { WatchlistItem } from '../../../../shared/models';
import { WatchlistItemComponent } from '../watchlist-item/watchlist-item.component';

@Component({
  selector: 'app-home-watchlist',
  imports: [WatchlistItemComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent {
  @Input() watchlistItems: WatchlistItem[] | null = [];
}
