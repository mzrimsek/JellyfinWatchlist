import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createComponentFactory, Spectator, mockProvider } from '@ngneat/spectator';
import { of } from 'rxjs';

import { AuthActions } from '../../actions/auth.actions';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;
  let store: jasmine.SpyObj<Store>;

  const createComponent = createComponentFactory({
    component: LoginComponent,
    imports: [ReactiveFormsModule],
    providers: [
      mockProvider(Store, {
        select: jasmine.createSpy('select').and.returnValue(of('Test Server')),
        dispatch: jasmine.createSpy('dispatch'),
      }),
    ],
    shallow: true, // This will prevent deep rendering of child components
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should initialize the login form with required validators', () => {
      const form = spectator.component.loginForm;

      expect(form).toBeDefined();
      expect(form?.get('username')?.hasError('required')).toBe(true);
      expect(form?.get('password')?.hasError('required')).toBe(true);
    });

    it('should select instance name from store', () => {
      expect(store.select).toHaveBeenCalled();
      expect(spectator.component.instanceName$).toBeDefined();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      spectator.detectChanges();
      spectator.component.loginForm?.patchValue({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should dispatch login action with form values', () => {
      spectator.component.login();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.login({
          username: 'testuser',
          password: 'testpass',
        }),
      );
    });

    it('should handle form submission with valid data', () => {
      const form = spectator.component.loginForm;
      form?.patchValue({ username: 'validuser', password: 'validpass' });

      spectator.component.login();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.login({
          username: 'validuser',
          password: 'validpass',
        }),
      );
    });
  });

  describe('getInstanceUrl', () => {
    it('should return environment jellyfin base url', () => {
      const result = spectator.component.getInstanceUrl();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should require username field', () => {
      const usernameControl = spectator.component.loginForm?.get('username');

      expect(usernameControl?.hasError('required')).toBe(true);

      usernameControl?.setValue('testuser');
      expect(usernameControl?.hasError('required')).toBe(false);
    });

    it('should require password field', () => {
      const passwordControl = spectator.component.loginForm?.get('password');

      expect(passwordControl?.hasError('required')).toBe(true);

      passwordControl?.setValue('testpass');
      expect(passwordControl?.hasError('required')).toBe(false);
    });

    it('should have valid form when both fields are filled', () => {
      const form = spectator.component.loginForm;

      expect(form?.valid).toBe(false);

      form?.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      expect(form?.valid).toBe(true);
    });
  });
});
