import {
  TEST_CONSTANTS,
  WatchlistItemFactory,
  createMockRepository,
} from '../test-utils/test-helpers';
import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { WatchlistItem } from '../entities/watchlist-item.entity';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let repository: jest.Mocked<Repository<WatchlistItem>>;

  beforeEach(async () => {
    const mockRepository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: getRepositoryToken(WatchlistItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    repository = module.get(getRepositoryToken(WatchlistItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllForUser', () => {
    it('should return all watchlist items for a user', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const expectedItems = WatchlistItemFactory.createMultiple(3, { jellyfinUserId: userId });
      repository.findBy.mockResolvedValue(expectedItems);

      // Act
      const result = await service.getAllForUser(userId);

      // Assert
      expect(result).toEqual(expectedItems);
      expect(repository.findBy).toHaveBeenCalledWith({ jellyfinUserId: userId });
      expect(repository.findBy).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no watchlist items', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      repository.findBy.mockResolvedValue([]);

      // Act
      const result = await service.getAllForUser(userId);

      // Assert
      expect(result).toEqual([]);
      expect(repository.findBy).toHaveBeenCalledWith({ jellyfinUserId: userId });
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const error = new Error('Database connection failed');
      repository.findBy.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getAllForUser(userId)).rejects.toThrow('Database connection failed');
      expect(repository.findBy).toHaveBeenCalledWith({ jellyfinUserId: userId });
    });
  });

  describe('getItemForUser', () => {
    it('should return a specific watchlist item for a user', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      const expectedItem = WatchlistItemFactory.create({
        id: itemId,
        jellyfinUserId: userId,
      });
      repository.findOne.mockResolvedValue(expectedItem);

      // Act
      const result = await service.getItemForUser(userId, itemId);

      // Assert
      expect(result).toEqual(expectedItem);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { jellyfinUserId: userId, id: itemId },
      });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when item is not found', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.INVALID_ITEM_ID;
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.getItemForUser(userId, itemId);

      // Assert
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { jellyfinUserId: userId, id: itemId },
      });
    });

    it('should return null when item belongs to different user', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      repository.findOne.mockResolvedValue(null); // Repository correctly filters by userId

      // Act
      const result = await service.getItemForUser(userId, itemId);

      // Assert
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { jellyfinUserId: userId, id: itemId },
      });
    });
  });

  describe('add', () => {
    it('should successfully add a new watchlist item', async () => {
      // Arrange
      const newItem = WatchlistItemFactory.create();
      repository.save.mockResolvedValue(newItem);

      // Act
      const result = await service.add(newItem);

      // Assert
      expect(result).toEqual(newItem);
      expect(repository.save).toHaveBeenCalledWith(newItem);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle repository save errors', async () => {
      // Arrange
      const newItem = WatchlistItemFactory.create();
      const error = new Error('Constraint violation');
      repository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(service.add(newItem)).rejects.toThrow('Constraint violation');
      expect(repository.save).toHaveBeenCalledWith(newItem);
    });

    it('should preserve all item properties when adding', async () => {
      // Arrange
      const newItem = WatchlistItemFactory.create({
        id: 'custom-id',
        name: 'Custom Movie',
        mediaType: 'Series',
        year: 2024,
        primaryImageUrl: 'https://custom.com/image.jpg',
        jellyfinUserId: 'custom-user',
        addedOn: new Date('2024-01-01'),
      });
      repository.save.mockResolvedValue(newItem);

      // Act
      const result = await service.add(newItem);

      // Assert
      expect(result).toEqual(newItem);
      expect(repository.save).toHaveBeenCalledWith(newItem);
    });
  });

  describe('delete', () => {
    it('should successfully delete a watchlist item', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      // Act
      await service.delete(userId, itemId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith({
        jellyfinUserId: userId,
        id: itemId,
      });
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle deletion of non-existent item gracefully', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.INVALID_ITEM_ID;
      repository.delete.mockResolvedValue({ affected: 0, raw: {} });

      // Act
      await service.delete(userId, itemId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith({
        jellyfinUserId: userId,
        id: itemId,
      });
    });

    it('should handle repository delete errors', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      const error = new Error('Database error');
      repository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.delete(userId, itemId)).rejects.toThrow('Database error');
      expect(repository.delete).toHaveBeenCalledWith({
        jellyfinUserId: userId,
        id: itemId,
      });
    });

    it('should only delete items for the specified user', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      // Act
      await service.delete(userId, itemId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith({
        jellyfinUserId: userId,
        id: itemId,
      });
      // Verify that both userId and itemId are required for deletion
      expect(repository.delete).not.toHaveBeenCalledWith({ id: itemId });
    });
  });
});
