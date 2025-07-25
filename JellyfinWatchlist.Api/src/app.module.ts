import * as Joi from 'joi';
import * as path from 'path';

import { ConfigModule } from '@nestjs/config';
import { ConfigModule as RuntimeConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistItem } from './entities';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    HealthModule,
    RuntimeConfigModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        JELLYFIN_INSTANCE: Joi.string().required(),
        CONFIG_PATH: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(process.env.CONFIG_PATH || '', 'db.sql'),
      entities: [WatchlistItem],
      migrations: [path.join(__dirname, 'migrations', '*.js')],
      synchronize: false,
      migrationsRun: true, // Automatically runs migrations on startup
    }),
    WatchlistModule,
  ],
})
export class AppModule {}
