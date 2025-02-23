import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SearchResult } from '../../models';

@Component({
  selector: 'app-search-results-list',
  imports: [],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent {
  @Input() results: Array<SearchResult> = [];
}
