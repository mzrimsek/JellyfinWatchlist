import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistController } from './watchlist.controller';
import { WatchlistItem } from 'src/entities';
import { WatchlistService } from './watchlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([WatchlistItem])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
