import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { metaReducers, reducers } from './reducers';

import { CONFIG_INITIALIZER_PROVIDER } from './config/config-initializer';
import { CurrentUserEffects } from './effects/current-user.effects';
import { InitEffects } from './effects/init.effects';
import { LoginEffects } from './effects/login.effects';
import { SearchEffects } from './effects/search.effects';
import { SystemInfoEffects } from './effects/system-info.effects';
import { WatchlistEffects } from './effects/watchlist.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(reducers, { metaReducers }),
    provideRouterStore(),
    provideHttpClient(),
    CONFIG_INITIALIZER_PROVIDER, // Load configuration before app initialization
    provideEffects(
      InitEffects,
      LoginEffects,
      SystemInfoEffects,
      CurrentUserEffects,
      SearchEffects,
      WatchlistEffects,
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
