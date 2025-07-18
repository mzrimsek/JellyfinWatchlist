import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;

  const createComponent = createComponentFactory({
    component: AppComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'JellyfinWatchlist.Web' title`, () => {
    expect(component.title).toEqual('JellyfinWatchlist.Web');
  });

  it('should render title', () => {
    spectator.detectChanges();
    expect(spectator.query('h1')).toContainText('Hello, JellyfinWatchlist.Web');
  });
});
