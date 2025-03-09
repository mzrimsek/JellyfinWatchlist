import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddWatchlistItem } from './models';
import { WatchlistItem } from 'src/entities';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get(':userId')
  getByUserId(@Param('userId') userId: string) {
    return this.watchlistService.getAllForUser(userId);
  }

  @Post(':userId')
  add(@Param('userId') userId: string, @Body() item: AddWatchlistItem) {
    const watchlistItem: WatchlistItem = {
      ...item,
      jellyfinUserId: userId,
      addedOn: new Date(),
    };
    return this.watchlistService.add(watchlistItem);
  }

  @Delete(':userId/:itemId')
  async delete(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    const existingItem = await this.watchlistService.getItemForUser(
      userId,
      itemId,
    );
    if (!existingItem) {
      throw new NotFoundException('Item not found');
    }
    return this.watchlistService.delete(userId, itemId);
  }
}
