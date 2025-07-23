/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, systemInfoReducer } from './system-info.reducer';

import { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models';
import { SystemInfoActions } from '../actions/system-info.actions';

describe('SystemInfoReducer', () => {
  const initialState: State = {
    publicSystemInfo: null,
    loading: false,
  };

  const mockSystemInfo: PublicSystemInfo = {
    Id: 'server-id-123',
    LocalAddress: 'http://localhost:8096',
    ServerName: 'Test Jellyfin Server',
    Version: '10.8.13',
    ProductName: 'Jellyfin Server',
    OperatingSystem: 'Linux',
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = systemInfoReducer(undefined, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('get action', () => {
    it('should set loading to true and maintain system info state', () => {
      const action = SystemInfoActions.get();
      const result = systemInfoReducer(initialState, action);

      expect(result).toEqual({
        publicSystemInfo: null,
        loading: true,
      });
    });

    it('should set loading to true from populated state', () => {
      const populatedState: State = {
        publicSystemInfo: mockSystemInfo,
        loading: false,
      };
      const action = SystemInfoActions.get();
      const result = systemInfoReducer(populatedState, action);

      expect(result).toEqual({
        publicSystemInfo: mockSystemInfo,
        loading: true,
      });
    });
  });

  describe('getSucceeded action', () => {
    it('should set system info and set loading to false', () => {
      const loadingState: State = {
        publicSystemInfo: null,
        loading: true,
      };
      const action = SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo });
      const result = systemInfoReducer(loadingState, action);

      expect(result).toEqual({
        publicSystemInfo: mockSystemInfo,
        loading: false,
      });
    });

    it('should update system info', () => {
      const differentSystemInfo: PublicSystemInfo = {
        Id: 'server-id-456',
        ServerName: 'Production Jellyfin Server',
        Version: '10.9.0',
        ProductName: 'Jellyfin Server',
        LocalAddress: 'http://production:8096',
        OperatingSystem: 'Windows',
      };
      const existingSystemInfoState: State = {
        publicSystemInfo: mockSystemInfo,
        loading: true,
      };
      const action = SystemInfoActions.getSucceeded({ systemInfo: differentSystemInfo });
      const result = systemInfoReducer(existingSystemInfoState, action);

      expect(result).toEqual({
        publicSystemInfo: differentSystemInfo,
        loading: false,
      });
    });

    it('should handle replacing existing system info', () => {
      const existingState: State = {
        publicSystemInfo: mockSystemInfo,
        loading: false,
      };
      const updatedSystemInfo: PublicSystemInfo = {
        ...mockSystemInfo,
        ServerName: 'Updated Jellyfin Server',
        Version: '10.8.14',
      };
      const action = SystemInfoActions.getSucceeded({ systemInfo: updatedSystemInfo });
      const result = systemInfoReducer(existingState, action);

      expect(result).toEqual({
        publicSystemInfo: updatedSystemInfo,
        loading: false,
      });
      expect(result.publicSystemInfo?.ServerName).toBe('Updated Jellyfin Server');
      expect(result.publicSystemInfo?.Version).toBe('10.8.14');
    });
  });

  describe('getFailed action', () => {
    it('should clear system info and set loading to false', () => {
      const loadingState: State = {
        publicSystemInfo: mockSystemInfo,
        loading: true,
      };
      const action = SystemInfoActions.getFailed();
      const result = systemInfoReducer(loadingState, action);

      expect(result).toEqual({
        publicSystemInfo: null,
        loading: false,
      });
    });

    it('should handle getFailed from initial state', () => {
      const action = SystemInfoActions.getFailed();
      const result = systemInfoReducer(initialState, action);

      expect(result).toEqual({
        publicSystemInfo: null,
        loading: false,
      });
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on get', () => {
      const originalState = { ...initialState };
      const action = SystemInfoActions.get();
      const result = systemInfoReducer(initialState, action);

      expect(initialState).toEqual(originalState);
      expect(result).not.toBe(initialState);
    });

    it('should not mutate original state on getSucceeded', () => {
      const loadingState: State = {
        publicSystemInfo: null,
        loading: true,
      };
      const originalState = { ...loadingState };
      const action = SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo });
      const result = systemInfoReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
      expect(result.publicSystemInfo).toBe(mockSystemInfo);
    });

    it('should not mutate original state on getFailed', () => {
      const loadingState: State = {
        publicSystemInfo: mockSystemInfo,
        loading: true,
      };
      const originalState = { ...loadingState };
      const action = SystemInfoActions.getFailed();
      const result = systemInfoReducer(loadingState, action);

      expect(loadingState).toEqual(originalState);
      expect(result).not.toBe(loadingState);
    });
  });

  describe('loading scenarios', () => {
    it('should handle rapid get/success cycles', () => {
      let currentState = initialState;

      // Start loading
      currentState = systemInfoReducer(currentState, SystemInfoActions.get());
      expect(currentState.loading).toBe(true);
      expect(currentState.publicSystemInfo).toBe(null);

      // Success
      currentState = systemInfoReducer(
        currentState,
        SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo }),
      );
      expect(currentState.loading).toBe(false);
      expect(currentState.publicSystemInfo).toEqual(mockSystemInfo);

      // Start loading again
      currentState = systemInfoReducer(currentState, SystemInfoActions.get());
      expect(currentState.loading).toBe(true);
      expect(currentState.publicSystemInfo).toEqual(mockSystemInfo); // Previous data maintained

      // Fail this time
      currentState = systemInfoReducer(currentState, SystemInfoActions.getFailed());
      expect(currentState.loading).toBe(false);
      expect(currentState.publicSystemInfo).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle version updates', () => {
      const oldVersionServer: PublicSystemInfo = {
        Id: 'server-123',
        ServerName: 'Jellyfin Server',
        Version: '10.8.0',
        ProductName: 'Jellyfin Server',
      };

      const newVersionServer: PublicSystemInfo = {
        Id: 'server-123',
        ServerName: 'Jellyfin Server',
        Version: '10.9.0',
        ProductName: 'Jellyfin Server',
      };

      let currentState = initialState;

      // Set old version
      currentState = systemInfoReducer(
        currentState,
        SystemInfoActions.getSucceeded({ systemInfo: oldVersionServer }),
      );
      expect(currentState.publicSystemInfo?.Version).toBe('10.8.0');

      // Update to new version
      currentState = systemInfoReducer(
        currentState,
        SystemInfoActions.getSucceeded({ systemInfo: newVersionServer }),
      );
      expect(currentState.publicSystemInfo?.Version).toBe('10.9.0');
    });

    it('should handle different operating systems', () => {
      const windowsServer: PublicSystemInfo = {
        Id: 'windows-server',
        ServerName: 'Windows Jellyfin',
        Version: '10.8.13',
        ProductName: 'Jellyfin Server',
        OperatingSystem: 'Windows',
      };

      const linuxServer: PublicSystemInfo = {
        Id: 'linux-server',
        ServerName: 'Linux Jellyfin',
        Version: '10.8.13',
        ProductName: 'Jellyfin Server',
        OperatingSystem: 'Linux',
      };

      let currentState = initialState;

      // Set Windows server
      currentState = systemInfoReducer(
        currentState,
        SystemInfoActions.getSucceeded({ systemInfo: windowsServer }),
      );
      expect(currentState.publicSystemInfo?.OperatingSystem).toBe('Windows');

      // Update to Linux server
      currentState = systemInfoReducer(
        currentState,
        SystemInfoActions.getSucceeded({ systemInfo: linuxServer }),
      );
      expect(currentState.publicSystemInfo?.OperatingSystem).toBe('Linux');
    });
  });
});
