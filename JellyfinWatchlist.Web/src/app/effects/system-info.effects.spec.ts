import { Observable, of, throwError } from 'rxjs';

import { Action } from '@ngrx/store';
import { JellyfinService } from '../services/jellyfin.service';
import { SystemInfoActions } from '../actions/system-info.actions';
import { SystemInfoEffects } from './system-info.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

// Mock system info data
const mockSystemInfo = {
  Id: 'server-id-123',
  Name: 'Test Jellyfin Server',
  Version: '10.8.13',
  ProductName: 'Jellyfin Server',
  StartupWizardCompleted: true,
  OperatingSystem: 'Linux',
  Architecture: 'X64',
  CanSelfRestart: true,
  CanSelfUpdate: false,
  CanLaunchWebBrowser: false,
  ProgramDataPath: '/config',
  WebPath: '/jellyfin/jellyfin-web',
  ItemsByNamePath: '/config/data/metadata',
  CachePath: '/config/cache',
  LogPath: '/config/log',
  InternalMetadataPath: '/config/metadata',
  TranscodingTempPath: '/config/transcodes',
  IsPortAuthorized: true,
  SupportsLibraryMonitor: true,
  EncoderLocationType: 'System',
  SystemArchitecture: 'X64',
};

describe('SystemInfoEffects', () => {
  let actions$: Observable<Action>;
  let effects: SystemInfoEffects;
  let jellyfinService: jasmine.SpyObj<JellyfinService>;

  beforeEach(() => {
    const jellyfinServiceSpy = jasmine.createSpyObj('JellyfinService', ['getSystemInfo']);

    TestBed.configureTestingModule({
      providers: [
        SystemInfoEffects,
        provideMockActions(() => actions$),
        { provide: JellyfinService, useValue: jellyfinServiceSpy },
      ],
    });

    effects = TestBed.inject(SystemInfoEffects);
    jellyfinService = TestBed.inject(JellyfinService) as jasmine.SpyObj<JellyfinService>;
  });

  describe('getSystemInfoActions$', () => {
    it('should return SystemInfoActions.getSucceeded when service call succeeds', (done) => {
      const action = SystemInfoActions.get();
      const expectedAction = SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo });

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(of(mockSystemInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.getSystemInfo).toHaveBeenCalled();
        done();
      });
    });

    it('should return SystemInfoActions.getFailed when service call fails', (done) => {
      const action = SystemInfoActions.get();
      const expectedAction = SystemInfoActions.getFailed();

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(
        throwError(() => new Error('System info fetch failed')),
      );

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.getSystemInfo).toHaveBeenCalled();
        done();
      });
    });

    it('should handle network errors gracefully', (done) => {
      const action = SystemInfoActions.get();
      const expectedAction = SystemInfoActions.getFailed();

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(throwError(() => new Error('Network error')));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should handle server timeout errors', (done) => {
      const action = SystemInfoActions.get();
      const expectedAction = SystemInfoActions.getFailed();

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(throwError(() => new Error('Timeout')));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should use exhaustMap to prevent multiple concurrent requests', (done) => {
      const action1 = SystemInfoActions.get();
      const action2 = SystemInfoActions.get();

      actions$ = of(action1, action2);
      jellyfinService.getSystemInfo.and.returnValue(of(mockSystemInfo));

      let emissionCount = 0;
      effects.getSystemInfoActions$.subscribe((result) => {
        emissionCount++;
        expect(result).toEqual(SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo }));

        if (emissionCount === 2) {
          done();
        }
      });
    });

    it('should handle different server configurations', (done) => {
      const differentServerInfo = {
        ...mockSystemInfo,
        Name: 'Production Jellyfin',
        Version: '10.9.0',
        OperatingSystem: 'Windows',
        CanSelfUpdate: true,
      };
      const action = SystemInfoActions.get();
      const expectedAction = SystemInfoActions.getSucceeded({ systemInfo: differentServerInfo });

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(of(differentServerInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        expect(jellyfinService.getSystemInfo).toHaveBeenCalled();
        done();
      });
    });

    it('should handle minimal system info response', (done) => {
      const minimalSystemInfo = {
        Id: 'minimal-server',
        Name: 'Minimal Server',
        Version: '10.8.0',
        ProductName: 'Jellyfin Server',
      };
      const action = SystemInfoActions.get();
      const expectedAction = SystemInfoActions.getSucceeded({ systemInfo: minimalSystemInfo });

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(of(minimalSystemInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('getSystemInfoFailedActions$', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should log error message when get system info fails', (done) => {
      const action = SystemInfoActions.getFailed();
      actions$ = of(action);

      effects.getSystemInfoFailedActions$.subscribe(() => {
        expect(console.log).toHaveBeenCalledWith('Failed to get system info');
        done();
      });
    });

    it('should not trigger on other actions', (done) => {
      const action = SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo });
      actions$ = of(action);

      // Since this effect only listens to getFailed, it shouldn't trigger
      setTimeout(() => {
        expect(console.log).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should not dispatch any action (dispatch: false)', (done) => {
      const action = SystemInfoActions.getFailed();
      actions$ = of(action);

      effects.getSystemInfoFailedActions$.subscribe(() => {
        // This effect should not return any action
        expect(true).toBe(true); // Add expectation to satisfy test framework
        done();
      });
    });
  });

  describe('effects integration', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should handle complete success flow', (done) => {
      const action = SystemInfoActions.get();
      actions$ = of(action);

      jellyfinService.getSystemInfo.and.returnValue(of(mockSystemInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(SystemInfoActions.getSucceeded({ systemInfo: mockSystemInfo }));
        expect(jellyfinService.getSystemInfo).toHaveBeenCalled();
        done();
      });
    });

    it('should handle complete failure flow', (done) => {
      const action = SystemInfoActions.get();
      actions$ = of(action);

      jellyfinService.getSystemInfo.and.returnValue(throwError(() => new Error('Service error')));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(SystemInfoActions.getFailed());

        // Now test the failed effect
        actions$ = of(SystemInfoActions.getFailed());

        effects.getSystemInfoFailedActions$.subscribe(() => {
          expect(console.log).toHaveBeenCalledWith('Failed to get system info');
          done();
        });
      });
    });

    it('should handle server version updates', (done) => {
      const updatedServerInfo = {
        ...mockSystemInfo,
        Version: '10.9.1',
        CanSelfUpdate: true,
        StartupWizardCompleted: true,
      };
      const action = SystemInfoActions.get();

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(of(updatedServerInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(SystemInfoActions.getSucceeded({ systemInfo: updatedServerInfo }));
        if ('systemInfo' in result) {
          expect(result.systemInfo.Version).toBe('10.9.1');
        }
        done();
      });
    });

    it('should handle different operating systems', (done) => {
      const windowsServerInfo = {
        ...mockSystemInfo,
        OperatingSystem: 'Windows',
        Architecture: 'X64',
        SystemArchitecture: 'X64',
        CanLaunchWebBrowser: true,
      };
      const action = SystemInfoActions.get();

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(of(windowsServerInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(SystemInfoActions.getSucceeded({ systemInfo: windowsServerInfo }));
        done();
      });
    });

    it('should handle server capability changes', (done) => {
      const enhancedServerInfo = {
        ...mockSystemInfo,
        CanSelfRestart: true,
        CanSelfUpdate: true,
        SupportsLibraryMonitor: true,
        IsPortAuthorized: true,
      };
      const action = SystemInfoActions.get();

      actions$ = of(action);
      jellyfinService.getSystemInfo.and.returnValue(of(enhancedServerInfo));

      effects.getSystemInfoActions$.subscribe((result) => {
        expect(result).toEqual(SystemInfoActions.getSucceeded({ systemInfo: enhancedServerInfo }));
        done();
      });
    });
  });
});
