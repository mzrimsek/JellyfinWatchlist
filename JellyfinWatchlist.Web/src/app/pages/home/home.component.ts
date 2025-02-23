import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { JellyfinService } from '../../services/jellyfin.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveInputComponent } from '../../shared/components/form/reactive-input/reactive-input.component';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveInputComponent,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  searchForm!: FormGroup;
  username: string = '';

  constructor(
    private jellyfinService: JellyfinService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.jellyfinService.getCurrentUser().then((user) => {
      this.username = user.Name ?? 'User';
    });
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
