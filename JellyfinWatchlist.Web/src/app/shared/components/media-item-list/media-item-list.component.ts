import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../models';

import { MatCardModule } from '@angular/material/card';
import { MediaItemComponent } from '../media-item/media-item.component';

@Component({
  selector: 'app-shared-media-item-list',
  imports: [MediaItemComponent, MatCardModule],
  templateUrl: './media-item-list.component.html',
  styleUrl: './media-item-list.component.scss',
})
export class MediaItemListComponent {
  @Input() items: Array<WatchlistItem> = [];
  @Input() watchlistIds: Array<string> = [];
  @Output() itemSelected = new EventEmitter<SelectWatchlistItemPayload>();

  itemIsPartOfWatchlist(item: WatchlistItem): boolean {
    return this.watchlistIds.includes(item.id);
  }
}
