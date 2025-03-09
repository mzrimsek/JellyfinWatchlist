import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { WatchlistItem } from '../../models';

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
  @Output() itemSelected = new EventEmitter<WatchlistItem>();

  selectItem(): void {
    this.itemSelected.emit(this.item);
  }

  get buttonText(): string {
    return this.isPartOfWatchlist
      ? 'Remove from Watchlist'
      : 'Add to Watchlist';
  }
}
