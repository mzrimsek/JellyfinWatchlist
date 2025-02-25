import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectJellyfinUserName } from '../../reducers';

@Component({
  selector: 'app-home',
  imports: [LayoutComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  username$: Observable<string> | undefined;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.username$ = this.store.select(selectJellyfinUserName);
  }
}
