import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { FormComponent } from './components/form/form.component';
import { JellyfinService } from '../../services/jellyfin.service';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { SearchResult } from './models';

@Component({
  selector: 'app-search',
  imports: [LayoutComponent, FormComponent, ResultsListComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchForm: FormGroup;
  searchResults: Array<SearchResult> = [];

  constructor(
    private jellyfinService: JellyfinService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required]],
    });
  }

  async search(): Promise<void> {
    const result = await this.jellyfinService.search(
      this.searchForm.value.query
    );
    const { SearchHints } = result;

    if (SearchHints) {
      const results = await Promise.all(
        SearchHints.map(async (hint) => {
          if (
            !hint.Id ||
            !hint.Name ||
            !hint.Type ||
            !hint.ProductionYear ||
            !hint.PrimaryImageTag
          ) {
            throw new Error('Search Result is missing expected properties');
          }
          const primaryImageUrl = this.jellyfinService.getItemPrimaryImageUrl(
            hint.Id,
            hint.PrimaryImageTag
          );
          return {
            id: hint.Id,
            name: hint.Name,
            mediaType: hint.Type,
            year: hint.ProductionYear,
            primaryImageUrl,
          };
        })
      );

      this.searchResults = results.filter(
        (result) => result !== null
      ) as SearchResult[];
      console.log(this.searchResults);
    } else {
      this.searchResults = [];
    }
  }
}
