import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let component: HeaderComponent;

  const createComponent = createComponentFactory({
    component: HeaderComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header content', () => {
    spectator.detectChanges();
    expect(spectator.element).toBeTruthy();
  });
});
