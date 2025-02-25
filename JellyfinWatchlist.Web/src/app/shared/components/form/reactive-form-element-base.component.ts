import { Directive, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Directive()
export abstract class ReactiveFormElementBaseComponent {
  @Input()
  group!: FormGroup;
  @Input() controlName = '';
  @Input() placeholder = '';
}
