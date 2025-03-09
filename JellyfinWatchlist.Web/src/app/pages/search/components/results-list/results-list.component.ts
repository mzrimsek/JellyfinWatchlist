import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MediaItemComponent } from '../../../../shared/components/media-item/media-item.component';
import { WatchlistItem } from '../../../../shared/models';

@Component({
  selector: 'app-search-results-list',
  imports: [MediaItemComponent, MatCardModule],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent {
  @Input() results: Array<WatchlistItem> = [];
  @Input() watchlistIds: Array<string> = [];
  @Output() itemSelected = new EventEmitter<WatchlistItem>();

  itemIsPartOfWatchlist(item: WatchlistItem): boolean {
    return this.watchlistIds.includes(item.id);
  }
}
