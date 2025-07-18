import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { FormComponent } from './form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveInputComponent } from '../../../../shared/components/form/reactive-input/reactive-input.component';

describe('FormComponent (Search)', () => {
  let spectator: Spectator<FormComponent>;
  let component: FormComponent;

  const createComponent = createComponentFactory({
    component: FormComponent,
    imports: [
      ReactiveFormsModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      NoopAnimationsModule,
    ],
    mocks: [ReactiveInputComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    const searchForm = new FormGroup({
      query: new FormControl('', [Validators.required]),
    });
    spectator.setInput('group', searchForm);
    spectator.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    it('should accept form group input', () => {
      const searchForm = new FormGroup({
        query: new FormControl('test search'),
      });
      spectator.setInput('group', searchForm);
      spectator.detectChanges();

      expect(component.group).toBe(searchForm);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      const searchForm = new FormGroup({
        query: new FormControl('', [Validators.required]),
      });
      spectator.setInput('group', searchForm);
      spectator.detectChanges();
    });

    it('should render search title', () => {
      expect(spectator.query('mat-card-title')).toHaveText('Search');
    });

    it('should render search subtitle', () => {
      expect(spectator.query('mat-card-subtitle')).toHaveText('Add New Media to Your Watchlist');
    });

    it('should render search button with correct text and icon', () => {
      const button = spectator.query('button[type="submit"]');
      expect(button).toExist();
      expect(button).toContainText('Search');
      expect(spectator.query('mat-icon')).toHaveText('search');
    });

    it('should pass query control to reactive input', () => {
      const reactiveInput = spectator.query(ReactiveInputComponent);
      expect(reactiveInput).toBeTruthy();
      expect(reactiveInput!.group).toBe(component.group);
      expect(reactiveInput!.controlName).toBe('query');
      expect(reactiveInput!.placeholder).toBe('Search media');
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      const searchForm = new FormGroup({
        query: new FormControl('', [Validators.required]),
      });
      spectator.setInput('group', searchForm);
      spectator.detectChanges();
    });

    it('should disable submit button when form is invalid', () => {
      // Form starts invalid due to required validator
      const button = spectator.query('button[type="submit"]');
      expect(button).toBeDisabled();
    });

    it('should enable submit button when form is valid', () => {
      // Make form valid
      component.group.patchValue({ query: 'test search' });
      spectator.detectChanges();

      const button = spectator.query('button[type="submit"]');
      expect(button).not.toBeDisabled();
    });

    it('should emit search event on form submission', () => {
      // Make form valid
      component.group.patchValue({ query: 'test search' });
      spectator.detectChanges();

      spyOn(component.search, 'emit');

      const form = spectator.query('form');
      expect(form).toBeTruthy();
      spectator.dispatchFakeEvent(form!, 'submit');

      expect(component.search.emit).toHaveBeenCalledWith();
    });

    it('should emit search event when submit button is clicked', () => {
      // Make form valid
      component.group.patchValue({ query: 'test search' });
      spectator.detectChanges();

      spyOn(component.search, 'emit');

      const button = spectator.query('button[type="submit"]');
      expect(button).toBeTruthy();
      spectator.click(button!);

      expect(component.search.emit).toHaveBeenCalledWith();
    });
  });

  describe('form validation states', () => {
    beforeEach(() => {
      const searchForm = new FormGroup({
        query: new FormControl('', [Validators.required]),
      });
      spectator.setInput('group', searchForm);
      spectator.detectChanges();
    });

    it('should have invalid form initially with required field empty', () => {
      expect(component.group.invalid).toBe(true);
      expect(component.group.get('query')?.hasError('required')).toBe(true);
    });

    it('should have valid form when query is provided', () => {
      component.group.patchValue({ query: 'test search' });
      expect(component.group.valid).toBe(true);
      expect(component.group.get('query')?.hasError('required')).toBe(false);
    });

    it('should become invalid again if query is cleared', () => {
      // Make valid first
      component.group.patchValue({ query: 'test search' });
      expect(component.group.valid).toBe(true);

      // Clear and check invalid
      component.group.patchValue({ query: '' });
      expect(component.group.invalid).toBe(true);
      expect(component.group.get('query')?.hasError('required')).toBe(true);
    });
  });
});
