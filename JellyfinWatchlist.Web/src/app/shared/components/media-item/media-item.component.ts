import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectWatchlistItemPayload, WatchlistItem } from '../../models';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-shared-media-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaItemComponent {
  @Input() item: WatchlistItem | undefined;
  @Input() isPartOfWatchlist = false;
  @Output() itemSelected = new EventEmitter<SelectWatchlistItemPayload>();

  selectItem(): void {
    if (this.item) {
      const payload: SelectWatchlistItemPayload = {
        item: this.item,
        action: this.isPartOfWatchlist ? 'remove' : 'add',
      };
      this.itemSelected.emit(payload);
    }
  }

  get buttonText(): string {
    return this.isPartOfWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
  }
}
