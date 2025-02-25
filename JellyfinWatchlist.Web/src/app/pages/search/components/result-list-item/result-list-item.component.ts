import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SearchResult } from '../../models';

@Component({
  selector: 'app-search-result-list-item',
  imports: [],
  templateUrl: './result-list-item.component.html',
  styleUrl: './result-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListItemComponent {
  @Input() item: SearchResult | undefined;
}
