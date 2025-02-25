import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { SearchResult } from '../../models';

@Component({
  selector: 'app-search-result-list-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './result-list-item.component.html',
  styleUrls: ['./result-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListItemComponent {
  @Input() item: SearchResult | undefined;
}
