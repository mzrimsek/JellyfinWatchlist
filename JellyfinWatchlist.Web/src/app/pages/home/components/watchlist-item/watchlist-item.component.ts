import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { WatchlistItem } from '../../../../shared/models';

@Component({
  selector: 'app-home-watchlist-item',
  imports: [CommonModule],
  templateUrl: './watchlist-item.component.html',
  styleUrl: './watchlist-item.component.scss',
})
export class WatchlistItemComponent {
  @Input() watchlistItem: WatchlistItem | undefined;
}
