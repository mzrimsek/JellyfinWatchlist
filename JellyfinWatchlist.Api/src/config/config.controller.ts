import { Controller, Get } from '@nestjs/common';

export interface RuntimeConfig {
  jellyfin: {
    baseUrl: string;
  };
  watchlist: {
    baseUrl: string;
  };
  production: boolean;
}

@Controller('config')
export class ConfigController {
  @Get()
  getConfig(): RuntimeConfig {
    // Dynamically determine the API's base URL
    const port = process.env.PORT ?? 3000;
    const host = process.env.HOST || 'localhost';
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

    return {
      jellyfin: {
        baseUrl: process.env.JELLYFIN_BASE_URL || 'http://localhost:8096',
      },
      watchlist: {
        // Dynamically build URL based on actual server configuration
        baseUrl: `${protocol}://${host}:${port}`,
      },
      production: process.env.NODE_ENV === 'production',
    };
  }
}
