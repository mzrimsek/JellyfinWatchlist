import { Api, Jellyfin } from '@jellyfin/sdk';
import {
  PublicSystemInfo,
  SearchHintResult,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { getImageApi } from '@jellyfin/sdk/lib/utils/api/image-api';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api';
import { getSearchApi } from '@jellyfin/sdk/lib/utils/api/search-api';
import { getSystemApi } from '@jellyfin/sdk/lib/utils/api/system-api';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';

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
  private api: Api;
  constructor() {
    // TODO need to persist this so we don't have to login every time
    this.api = this.sdk.createApi(environment.jellyfin.baseUrl);
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.api.authenticateUserByName(
        username,
        password
      );
      return response.status === 200 && !!response.data.AccessToken;
    } catch {
      return false;
    }
  }

  public get isAuthenticated(): boolean {
    return !!this.api.accessToken;
  }

  public async logout(): Promise<void> {
    await this.api.logout();
  }

  public async getCurrentUser(): Promise<UserDto> {
    const userApi = getUserApi(this.api);
    const response = await userApi.getCurrentUser();
    return response.data;
  }

  public async getSystemInfo(): Promise<PublicSystemInfo> {
    const systemApi = getSystemApi(this.api);
    const response = await systemApi.getPublicSystemInfo();
    return response.data;
  }

  public async search(query: string): Promise<SearchHintResult> {
    const searchApi = getSearchApi(this.api);

    const currentUser = await this.getCurrentUser();
    const response = await searchApi.getSearchHints({
      searchTerm: query,
      userId: currentUser.Id,
      includeItemTypes: ['Movie', 'Series'],
    });
    return response.data;
  }

  public async getItemPrimaryImage(id: string): Promise<File> {
    const imageApi = getImageApi(this.api);
    const response = await imageApi.getItemImage({
      itemId: id,
      imageType: 'Primary',
    });
    return response.data;
  }
}
