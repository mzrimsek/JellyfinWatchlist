import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { ResultListItemComponent } from '../result-list-item/result-list-item.component';
import { SearchResult } from '../../models';

@Component({
  selector: 'app-search-results-list',
  imports: [ResultListItemComponent, MatCardModule],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent {
  @Input() results: Array<SearchResult> = [];
}
