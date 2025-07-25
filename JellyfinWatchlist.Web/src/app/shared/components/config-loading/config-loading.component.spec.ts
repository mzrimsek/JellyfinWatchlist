import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ConfigLoadingComponent } from './config-loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ConfigLoadingComponent', () => {
  let spectator: Spectator<ConfigLoadingComponent>;

  const createComponent = createComponentFactory({
    component: ConfigLoadingComponent,
    imports: [MatProgressSpinnerModule],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display loading spinner', () => {
    spectator.detectChanges();

    expect(spectator.query('mat-spinner')).toExist();
  });

  it('should display loading message', () => {
    spectator.detectChanges();

    expect(spectator.query('h2')).toHaveText('Loading Configuration...');
    expect(spectator.query('p')).toHaveText('Please wait while we set up your application');
  });

  it('should have proper styling classes', () => {
    spectator.detectChanges();

    expect(spectator.query('.config-loading-container')).toExist();
    expect(spectator.query('.config-loading-content')).toExist();
  });
});
