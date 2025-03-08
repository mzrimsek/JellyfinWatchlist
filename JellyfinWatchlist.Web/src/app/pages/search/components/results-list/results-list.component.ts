import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MediaItem } from '../../../../shared/models';
import { MediaItemComponent } from '../../../../shared/components/media-item/media-item.component';

@Component({
  selector: 'app-search-results-list',
  imports: [MediaItemComponent, MatCardModule],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent {
  @Input() results: Array<MediaItem> = [];
}
