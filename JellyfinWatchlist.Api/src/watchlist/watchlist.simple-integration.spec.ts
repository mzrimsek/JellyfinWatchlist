import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistService } from './watchlist.service';
import { WatchlistItem } from '../entities/watchlist-item.entity';

describe('WatchlistService (Integration) - Simple', () => {
  let service: WatchlistService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [WatchlistItem],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([WatchlistItem]),
      ],
      providers: [WatchlistService],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add and retrieve a watchlist item', async () => {
    const testItem: WatchlistItem = {
      id: 'test-item-123',
      name: 'Test Movie',
      mediaType: 'Movie',
      year: 2023,
      primaryImageUrl: 'https://example.com/image.jpg',
      jellyfinUserId: 'user-123',
      addedOn: new Date(),
    };

    const savedItem = await service.add(testItem);
    expect(savedItem).toEqual(testItem);

    const retrievedItems = await service.getAllForUser('user-123');
    expect(retrievedItems).toHaveLength(1);
    expect(retrievedItems[0]).toEqual(testItem);
  });
});
