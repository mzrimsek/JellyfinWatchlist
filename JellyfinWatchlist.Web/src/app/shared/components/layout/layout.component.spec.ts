import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let spectator: Spectator<LayoutComponent>;
  let component: LayoutComponent;

  const createComponent = createComponentFactory({
    component: LayoutComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render layout structure', () => {
    spectator.detectChanges();
    expect(spectator.element).toBeTruthy();
  });
});
