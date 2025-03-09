import * as Joi from 'joi';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistItem } from './entities';

@Module({
  imports: [
    HealthModule,
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
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
