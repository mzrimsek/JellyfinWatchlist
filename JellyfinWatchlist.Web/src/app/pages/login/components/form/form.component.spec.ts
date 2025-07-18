import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FormComponent } from './form.component';
import { ReactiveInputComponent } from '../../../../shared/components/form/reactive-input/reactive-input.component';

describe('FormComponent (Login)', () => {
  let spectator: Spectator<FormComponent>;
  let component: FormComponent;

  const createComponent = createComponentFactory({
    component: FormComponent,
    imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule],
    mocks: [ReactiveInputComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    // Create a realistic form group like the LoginComponent would
    const fb = new FormBuilder();
    component.group = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    component.instanceUrl = 'http://localhost:8096';
    component.instanceName = 'Test Jellyfin Server';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should accept form group input', () => {
      expect(component.group).toBeDefined();
      expect(component.group.get('username')).toBeTruthy();
      expect(component.group.get('password')).toBeTruthy();
    });

    it('should accept instance URL input', () => {
      expect(component.instanceUrl).toBe('http://localhost:8096');
    });

    it('should accept instance name input', () => {
      expect(component.instanceName).toBe('Test Jellyfin Server');
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should render login title', () => {
      const title = spectator.query('mat-card-title');
      expect(title).toHaveText('Login');
    });

    it('should render instance name and URL in subtitle', () => {
      const subtitle = spectator.query('mat-card-subtitle');
      expect(subtitle).toContainText('Test Jellyfin Server');

      const link = spectator.query('a[href="http://localhost:8096"]');
      expect(link).toExist();
      expect(link).toHaveText('Test Jellyfin Server');
    });

    it('should render submit button with correct text', () => {
      const button = spectator.query('button[type="submit"]');
      expect(button).toExist();
      expect(button).toContainText('Login with Jellyfin');
    });

    it('should pass username control to reactive input', () => {
      const usernameInput = spectator.query('[controlName="username"]');
      expect(usernameInput).toExist();
    });

    it('should pass password control to reactive input', () => {
      const passwordInput = spectator.query('[controlName="password"]');
      expect(passwordInput).toExist();
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should disable submit button when form is invalid', () => {
      const button = spectator.query('button[type="submit"]');
      expect(button).toBeDisabled();
    });

    it('should enable submit button when form is valid', () => {
      component.group.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      spectator.detectChanges();

      const button = spectator.query('button[type="submit"]');
      expect(button).not.toBeDisabled();
    });

    it('should emit login event on form submission', () => {
      spyOn(component.login, 'emit');

      component.group.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      spectator.detectChanges();

      const form = spectator.query('form');
      spectator.dispatchFakeEvent(form!, 'submit');

      expect(component.login.emit).toHaveBeenCalled();
    });

    it('should emit login event when submit button is clicked', () => {
      spyOn(component.login, 'emit');

      component.group.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      spectator.detectChanges();

      const button = spectator.query('button[type="submit"]');
      spectator.click(button!);

      expect(component.login.emit).toHaveBeenCalled();
    });
  });

  describe('form validation states', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should have invalid form initially', () => {
      expect(component.group.invalid).toBe(true);
    });

    it('should have valid form when all required fields are filled', () => {
      component.group.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      expect(component.group.valid).toBe(true);
    });

    it('should remain invalid if username is missing', () => {
      component.group.patchValue({
        password: 'testpass',
      });

      expect(component.group.invalid).toBe(true);
    });

    it('should remain invalid if password is missing', () => {
      component.group.patchValue({
        username: 'testuser',
      });

      expect(component.group.invalid).toBe(true);
    });
  });
});
