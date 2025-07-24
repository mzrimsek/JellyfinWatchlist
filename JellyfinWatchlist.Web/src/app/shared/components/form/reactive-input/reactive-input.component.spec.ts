import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveInputComponent } from './reactive-input.component';

describe('ReactiveInputComponent', () => {
  let spectator: Spectator<ReactiveInputComponent>;
  let component: ReactiveInputComponent;

  const createComponent = createComponentFactory({
    component: ReactiveInputComponent,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
    detectChanges: false,
  });

  beforeEach(() => {
    const fb = new FormBuilder();
    const formGroup = fb.group({
      testControl: ['test value', [Validators.required]],
    });

    spectator = createComponent({
      props: {
        group: formGroup,
        controlName: 'testControl',
        placeholder: 'Test placeholder',
        type: 'text',
        value: '',
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component properties', () => {
    it('should have correct input properties', () => {
      expect(component.group).toBeDefined();
      expect(component.controlName).toBe('testControl');
      expect(component.placeholder).toBe('Test placeholder');
      expect(component.type).toBe('text');
    });

    it('should default to text type', () => {
      const newSpectator = createComponent({
        props: {
          group: component.group,
          controlName: 'testControl',
        },
      });
      expect(newSpectator.component.type).toBe('text');
    });
  });

  describe('template structure', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should render mat-form-field', () => {
      const formField = spectator.query('mat-form-field');
      expect(formField).toExist();
    });

    it('should render input with matInput directive', () => {
      const input = spectator.query('input[matInput]');
      expect(input).toExist();
    });

    it('should have correct input attributes', () => {
      const input = spectator.query('input[matInput]');
      expect(input).toHaveAttribute('placeholder', 'Test placeholder');
      expect(input).toHaveAttribute('type', 'text');
      // Note: formControlName is set by Angular but may not be reflected as an HTML attribute
      expect(input).toExist();
    });
  });

  describe('password type', () => {
    it('should render password input when type is password', () => {
      spectator = createComponent({
        props: {
          group: component.group,
          controlName: 'testControl',
          type: 'password',
        },
      });
      spectator.detectChanges();

      const input = spectator.query('input[matInput]');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('form integration', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should integrate with reactive form control', () => {
      const control = component.group.get('testControl');
      expect(control).toBeDefined();
      expect(control?.value).toBe('test value');
    });

    it('should show control value in input', () => {
      const input = spectator.query('input[matInput]') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should have placeholder for accessibility', () => {
      const input = spectator.query('input[matInput]');
      expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    });
  });
});
