import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveInputComponent } from '../../../../shared/components/form/reactive-input/reactive-input.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveInputComponent,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  @Input()
  group!: FormGroup;
  @Output() login: EventEmitter<void> = new EventEmitter<void>();

  getJellyfinInstanceUrl(): string {
    return environment.jellyfin.baseUrl;
  }
}
