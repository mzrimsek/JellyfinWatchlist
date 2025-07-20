import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../../../shared/models';

import { MediaItemComponent } from '../../../../shared/components/media-item/media-item.component';

@Component({
  selector: 'app-home-watchlist',
  imports: [MediaItemComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent {
  @Input() watchlistItems: WatchlistItem[] | null = [];
  @Output() itemSelected = new EventEmitter<SelectWatchlistItemPayload>();
}
