import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: ConfigService,
        useValue: {
          isLoaded$: of(true),
          config$: of({
            jellyfin: { baseUrl: 'https://test-jellyfin.example.com' },
            watchlist: { baseUrl: 'https://test-api.example.com' },
            production: false,
          }),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
