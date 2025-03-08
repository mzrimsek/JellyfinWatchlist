import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorFunction,
  HttpHealthIndicator,
} from '@nestjs/terminus';

import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const jellyfinInstance =
      this.configService.get<string>('JELLYFIN_INSTANCE');

    let checks: Array<HealthIndicatorFunction> = [
      () => this.http.pingCheck('google', 'https://google.com'),
      () => this.http.pingCheck('jellyfin', 'https://jellyfin.org'),
    ];

    if (jellyfinInstance) {
      checks = [
        ...checks,
        () => this.http.pingCheck('jellyfin instance', jellyfinInstance),
      ];
    }

    return this.health.check(checks);
  }
}
