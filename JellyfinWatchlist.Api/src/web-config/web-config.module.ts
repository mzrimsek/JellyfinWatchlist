import { Module } from '@nestjs/common';
import { WebConfigController } from './web-config.controller';

@Module({
  controllers: [WebConfigController]
})
export class WebConfigModule {}
