import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorFunction,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const jellyfinInstance =
      this.configService.get<string>('JELLYFIN_INSTANCE');

    let checks: Array<HealthIndicatorFunction> = [
      () => this.http.pingCheck('google', 'https://google.com'),
      () => this.db.pingCheck('database'),
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
