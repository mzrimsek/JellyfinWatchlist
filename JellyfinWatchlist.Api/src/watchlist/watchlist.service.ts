import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WatchlistItem } from '../entities/watchlist-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(WatchlistItem)
    private watchlistRepository: Repository<WatchlistItem>,
  ) {}

  getAllForUser(userId: string): Promise<WatchlistItem[]> {
    return this.watchlistRepository.findBy({
      jellyfinUserId: userId,
    });
  }

  getItemForUser(
    userId: string,
    itemId: string,
  ): Promise<WatchlistItem | null> {
    return this.watchlistRepository.findOne({
      where: {
        jellyfinUserId: userId,
        id: itemId,
      },
    });
  }

  add(item: WatchlistItem): Promise<WatchlistItem> {
    return this.watchlistRepository.save(item);
  }

  async delete(userId: string, itemId: string): Promise<void> {
    await this.watchlistRepository.delete({
      jellyfinUserId: userId,
      id: itemId,
    });
  }
}
