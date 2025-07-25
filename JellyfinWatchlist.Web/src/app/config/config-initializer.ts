import { APP_INITIALIZER, Provider } from '@angular/core';
import { ConfigService } from '../services/config.service';

/**
 * Configuration Initializer Function
 *
 * This function is called during Angular's APP_INITIALIZER phase,
 * ensuring that runtime configuration is loaded before the application
 * components are initialized.
 */
export function configInitializerFactory(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}

/**
 * Configuration Initializer Provider
 *
 * Provides the APP_INITIALIZER token with our configuration loading function.
 * This ensures that the ConfigService.loadConfig() is called before the app starts.
 */
export const CONFIG_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: configInitializerFactory,
  deps: [ConfigService],
  multi: true,
};
