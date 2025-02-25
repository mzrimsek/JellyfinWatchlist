import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormElementBaseComponent } from '../reactive-form-element-base.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-reactive-input',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './reactive-input.component.html',
  styleUrl: './reactive-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveInputComponent extends ReactiveFormElementBaseComponent {
  @Input() value = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
}
