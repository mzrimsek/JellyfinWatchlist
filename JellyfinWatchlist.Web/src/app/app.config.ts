import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { metaReducers, reducers } from './reducers';

import { CurrentUserEffects } from './effects/current-user.effects';
import { InitEffects } from './effects/init.effects';
import { LoginEffects } from './effects/login.effects';
import { SystemInfoEffects } from './effects/system-info.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
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
    provideEffects(
      InitEffects,
      LoginEffects,
      SystemInfoEffects,
      CurrentUserEffects
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
