import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let spectator: Spectator<FormComponent>;
  let component: FormComponent;

  const createComponent = createComponentFactory({
    component: FormComponent,
    imports: [ReactiveFormsModule],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    
    // Create a mock form group
    const fb = new FormBuilder();
    component.group = fb.group({
      baseUrl: [''],
      username: [''],
      password: ['']
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept form group input', () => {
    spectator.detectChanges();
    expect(component.group).toBeDefined();
    expect(component.group.get('baseUrl')).toBeTruthy();
    expect(component.group.get('username')).toBeTruthy();
    expect(component.group.get('password')).toBeTruthy();
  });
});
