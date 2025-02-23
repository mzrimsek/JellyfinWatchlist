import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { JellyfinService } from '../../services/jellyfin.service';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-search',
  imports: [LayoutComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchForm: FormGroup;

  constructor(
    private jellyfinService: JellyfinService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required]],
    });
  }

  search(): void {
    this.jellyfinService.search(this.searchForm.value.query).then((result) => {
      console.log(result);
    });
  }
}
