import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { WatchlistItem } from '../entities/watchlist-item.entity';
import { AddWatchlistItem } from './models';
import { WatchlistItemFactory, TEST_CONSTANTS } from '../test-utils/test-helpers';

describe('WatchlistController', () => {
  let controller: WatchlistController;
  let service: jest.Mocked<WatchlistService>;

  const mockWatchlistService = {
    getAllForUser: jest.fn(),
    getItemForUser: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
    service = module.get(WatchlistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByUserId', () => {
    it('should return all watchlist items for a user', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const expectedItems = WatchlistItemFactory.createMultiple(2, { jellyfinUserId: userId });
      service.getAllForUser.mockResolvedValue(expectedItems);

      // Act
      const result = await controller.getByUserId(userId);

      // Assert
      expect(result).toEqual(expectedItems);
      expect(service.getAllForUser).toHaveBeenCalledWith(userId);
      expect(service.getAllForUser).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no items', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      service.getAllForUser.mockResolvedValue([]);

      // Act
      const result = await controller.getByUserId(userId);

      // Assert
      expect(result).toEqual([]);
      expect(service.getAllForUser).toHaveBeenCalledWith(userId);
    });

    it('should handle service errors', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const error = new Error('Service error');
      service.getAllForUser.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getByUserId(userId)).rejects.toThrow('Service error');
      expect(service.getAllForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('add', () => {
    it('should successfully add a new watchlist item', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const addItemDto: AddWatchlistItem = {
        id: TEST_CONSTANTS.ITEM_ID,
        name: 'Test Movie',
        mediaType: 'Movie',
        year: 2023,
        primaryImageUrl: 'https://example.com/image.jpg',
      };
      
      const expectedWatchlistItem: WatchlistItem = {
        ...addItemDto,
        jellyfinUserId: userId,
        addedOn: expect.any(Date),
      };
      
      service.add.mockResolvedValue(expectedWatchlistItem);

      // Act
      const result = await controller.add(userId, addItemDto);

      // Assert
      expect(result).toEqual(expectedWatchlistItem);
      expect(service.add).toHaveBeenCalledWith(expectedWatchlistItem);
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it('should set the correct jellyfinUserId and addedOn timestamp', async () => {
      // Arrange
      const userId = 'user-456';
      const addItemDto: AddWatchlistItem = {
        id: 'item-789',
        name: 'Another Movie',
        mediaType: 'Series',
        year: 2024,
        primaryImageUrl: 'https://example.com/another.jpg',
      };

      const beforeTimestamp = new Date();
      
      // Act
      await controller.add(userId, addItemDto);
      
      const afterTimestamp = new Date();

      // Assert
      expect(service.add).toHaveBeenCalledWith({
        ...addItemDto,
        jellyfinUserId: userId,
        addedOn: expect.any(Date),
      });

      const calledItem = service.add.mock.calls[0][0];
      expect(calledItem.addedOn.getTime()).toBeGreaterThanOrEqual(beforeTimestamp.getTime());
      expect(calledItem.addedOn.getTime()).toBeLessThanOrEqual(afterTimestamp.getTime());
    });

    it('should preserve all properties from AddWatchlistItem', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const addItemDto: AddWatchlistItem = {
        id: 'custom-id-123',
        name: 'Custom Movie Name',
        mediaType: 'Documentary',
        year: 2022,
        primaryImageUrl: 'https://custom.domain.com/image.png',
      };

      // Act
      await controller.add(userId, addItemDto);

      // Assert
      expect(service.add).toHaveBeenCalledWith({
        id: 'custom-id-123',
        name: 'Custom Movie Name',
        mediaType: 'Documentary',
        year: 2022,
        primaryImageUrl: 'https://custom.domain.com/image.png',
        jellyfinUserId: userId,
        addedOn: expect.any(Date),
      });
    });

    it('should handle service add errors', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const addItemDto: AddWatchlistItem = {
        id: TEST_CONSTANTS.ITEM_ID,
        name: 'Test Movie',
        mediaType: 'Movie',
        year: 2023,
        primaryImageUrl: 'https://example.com/image.jpg',
      };
      const error = new Error('Database constraint violation');
      service.add.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.add(userId, addItemDto)).rejects.toThrow('Database constraint violation');
      expect(service.add).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should successfully delete an existing watchlist item', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      const existingItem = WatchlistItemFactory.create({ 
        id: itemId, 
        jellyfinUserId: userId 
      });
      
      service.getItemForUser.mockResolvedValue(existingItem);
      service.delete.mockResolvedValue();

      // Act
      const result = await controller.delete(userId, itemId);

      // Assert
      expect(result).toBeUndefined();
      expect(service.getItemForUser).toHaveBeenCalledWith(userId, itemId);
      expect(service.delete).toHaveBeenCalledWith(userId, itemId);
      expect(service.getItemForUser).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.INVALID_ITEM_ID;
      service.getItemForUser.mockResolvedValue(null);

      // Act & Assert
      await expect(controller.delete(userId, itemId)).rejects.toThrow(NotFoundException);
      await expect(controller.delete(userId, itemId)).rejects.toThrow('Item not found');
      
      expect(service.getItemForUser).toHaveBeenCalledWith(userId, itemId);
      expect(service.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when item belongs to different user', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      service.getItemForUser.mockResolvedValue(null); // Service correctly filters by user

      // Act & Assert
      await expect(controller.delete(userId, itemId)).rejects.toThrow(NotFoundException);
      
      expect(service.getItemForUser).toHaveBeenCalledWith(userId, itemId);
      expect(service.delete).not.toHaveBeenCalled();
    });

    it('should handle service getItemForUser errors', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      const error = new Error('Database connection error');
      service.getItemForUser.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.delete(userId, itemId)).rejects.toThrow('Database connection error');
      
      expect(service.getItemForUser).toHaveBeenCalledWith(userId, itemId);
      expect(service.delete).not.toHaveBeenCalled();
    });

    it('should handle service delete errors after successful item lookup', async () => {
      // Arrange
      const userId = TEST_CONSTANTS.USER_ID;
      const itemId = TEST_CONSTANTS.ITEM_ID;
      const existingItem = WatchlistItemFactory.create({ 
        id: itemId, 
        jellyfinUserId: userId 
      });
      
      service.getItemForUser.mockResolvedValue(existingItem);
      const deleteError = new Error('Delete operation failed');
      service.delete.mockRejectedValue(deleteError);

      // Act & Assert
      await expect(controller.delete(userId, itemId)).rejects.toThrow('Delete operation failed');
      
      expect(service.getItemForUser).toHaveBeenCalledWith(userId, itemId);
      expect(service.delete).toHaveBeenCalledWith(userId, itemId);
    });
  });
});
