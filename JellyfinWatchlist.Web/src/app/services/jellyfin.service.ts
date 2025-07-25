import { Api, Jellyfin } from '@jellyfin/sdk';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, take, switchMap } from 'rxjs';
import {
  PublicSystemInfo,
  SearchHintResult,
  UserDto,
  AuthenticationResult,
} from '@jellyfin/sdk/lib/generated-client/models';

import { Store } from '@ngrx/store';
import { ConfigService } from './config.service';
import { getSearchApi } from '@jellyfin/sdk/lib/utils/api/search-api';
import { getSystemApi } from '@jellyfin/sdk/lib/utils/api/system-api';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import { selectAccessToken } from '../reducers/auth.reducer';
import { AxiosResponse } from 'axios';
import { toObservable } from '../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class JellyfinService {
  private sdk = new Jellyfin({
    clientInfo: {
      name: 'Jellyfin Watchlist',
      version: '1.0.0',
    },
    deviceInfo: {
      name: 'Jellyfin Watchlist',
      id: 'JellyfinWatchlist',
    },
  });
  private api: Api | null = null;
  private configService = inject(ConfigService);
  private store = inject(Store);

  constructor() {
    // Initialize API once configuration is loaded
    this.initializeApi();
  }

  private initializeApi(): void {
    // Wait for configuration to be loaded, then initialize the API
    this.configService.config$
      .pipe(
        take(1), // Only take the first emission (when config is loaded)
      )
      .subscribe((config) => {
        if (config.jellyfin.baseUrl) {
          this.api = this.sdk.createApi(config.jellyfin.baseUrl);
          this.setupAccessTokenSubscription();
        }
      });
  }

  private setupAccessTokenSubscription(): void {
    if (!this.api) return;

    // Set up access token subscription for authentication
    const accessToken$ = this.store.select(selectAccessToken);
    accessToken$.subscribe((token) => {
      if (token && this.api) {
        this.api.accessToken = token;
      }
    });
  }

  private ensureApiInitialized(): Observable<Api> {
    if (this.api) {
      return of(this.api);
    }

    // If API is not initialized, wait for configuration to load
    return this.configService.config$.pipe(
      take(1),
      map((config) => {
        if (!this.api && config.jellyfin.baseUrl) {
          this.api = this.sdk.createApi(config.jellyfin.baseUrl);
          this.setupAccessTokenSubscription();
        }
        if (!this.api) {
          throw new Error('Unable to initialize Jellyfin API - base URL not configured');
        }
        return this.api;
      }),
    );
  }

  public login(username: string, password: string): Observable<string | null> {
    return this.ensureApiInitialized().pipe(
      switchMap((api: Api) =>
        toObservable(api.authenticateUserByName(username, password)).pipe(
          map((response: AxiosResponse<AuthenticationResult>) =>
            response.data.AccessToken ? response.data.AccessToken : null,
          ),
          catchError(() => of(null)),
        ),
      ),
    );
  }

  public logout(): Observable<void> {
    return this.ensureApiInitialized().pipe(
      switchMap((api: Api) => toObservable(api.logout()).pipe(map(() => undefined))),
    );
  }

  public getCurrentUser(): Observable<UserDto> {
    return this.ensureApiInitialized().pipe(
      switchMap((api: Api) => {
        const userApi = getUserApi(api);
        return toObservable(userApi.getCurrentUser()).pipe(
          map((response: AxiosResponse<UserDto>) => response.data),
        );
      }),
    );
  }

  public getSystemInfo(): Observable<PublicSystemInfo> {
    return this.ensureApiInitialized().pipe(
      switchMap((api: Api) => {
        const systemApi = getSystemApi(api);
        return toObservable(systemApi.getPublicSystemInfo()).pipe(
          map((response: AxiosResponse<PublicSystemInfo>) => response.data),
        );
      }),
    );
  }

  public search(query: string, userId: string): Observable<SearchHintResult> {
    return this.ensureApiInitialized().pipe(
      switchMap((api: Api) => {
        const searchApi = getSearchApi(api);
        return toObservable(
          searchApi.getSearchHints({
            searchTerm: query,
            userId,
            includeItemTypes: ['Movie', 'Series'],
          }),
        ).pipe(map((response: AxiosResponse<SearchHintResult>) => response.data));
      }),
    );
  }

  public getItemPrimaryImageUrl(
    itemId: string,
    tag: string,
    quality = 90,
    fillHeight = 495,
    fillWidth = 330,
  ): string {
    // TODO: This is a hack to get the image url. We should use the SDK to get the image url
    // someone enlighten me on how to properly convert the image I am getting back to a data url and I will fix this
    const baseUrl = this.configService.jellyfinBaseUrl;
    return `${baseUrl}/Items/${itemId}/Images/Primary?tag=${tag}&quality=${quality}&fillHeight=${fillHeight}&fillWidth=${fillWidth}`;
  }
}
