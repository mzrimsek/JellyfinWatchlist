import { Api, Jellyfin } from '@jellyfin/sdk';

import { Injectable } from '@angular/core';
import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';
import { environment } from '../../environments/environment';
import { getUserApi } from '../../../node_modules/@jellyfin/sdk/lib/utils/api/user-api';

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

  public async getCurrentUser(): Promise<UserDto> {
    const userApi = getUserApi(this.api);
    const response = await userApi.getCurrentUser();
    return response.data;
  }
}
