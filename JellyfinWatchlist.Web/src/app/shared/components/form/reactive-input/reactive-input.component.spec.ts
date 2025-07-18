import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ReactiveInputComponent } from './reactive-input.component';

describe('ReactiveInputComponent', () => {
  let spectator: Spectator<ReactiveInputComponent>;
  let component: ReactiveInputComponent;

  const createComponent = createComponentFactory({
    component: ReactiveInputComponent,
    imports: [ReactiveFormsModule],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    
    // Set up form group
    const fb = new FormBuilder();
    component.group = fb.group({
      testControl: ['test value']
    });
    component.controlName = 'testControl';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept form group and control name inputs', () => {
    spectator.detectChanges();
    
    expect(component.group).toBeDefined();
    expect(component.controlName).toBe('testControl');
    expect(component.group.get('testControl')?.value).toBe('test value');
  });

  it('should accept placeholder input', () => {
    spectator.setInput('placeholder', 'Enter text');
    spectator.detectChanges();
    
    expect(component.placeholder).toBe('Enter text');
  });
});
