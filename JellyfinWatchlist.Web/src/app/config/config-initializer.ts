import { inject, provideAppInitializer } from '@angular/core';
import { ConfigService } from '../services/config.service';

export function initializeConfig(): Promise<void> {
  const configService = inject(ConfigService);
  return configService.loadConfig();
}

export function provideConfigInitializer() {
  return provideAppInitializer(initializeConfig);
}
