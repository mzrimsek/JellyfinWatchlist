import { Api, Jellyfin } from '@jellyfin/sdk';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import {
  PublicSystemInfo,
  SearchHintResult,
  UserDto,
} from '@jellyfin/sdk/lib/generated-client/models';

import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { getSearchApi } from '@jellyfin/sdk/lib/utils/api/search-api';
import { getSystemApi } from '@jellyfin/sdk/lib/utils/api/system-api';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import { selectAccessToken } from '../reducers/auth.reducer';
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
  private api: Api;
  constructor() {
    this.api = this.sdk.createApi(environment.jellyfin.baseUrl);

    // if we have already logged in and are reloading the page
    // we can grab the access token from the store and authorize the api
    const store = inject(Store);
    const accessToken$ = store.select(selectAccessToken);
    accessToken$.subscribe((token) => {
      if (token) {
        this.api.accessToken = token;
      }
    });
  }

  public login(username: string, password: string): Observable<string | null> {
    return toObservable(this.api.authenticateUserByName(username, password)).pipe(
      map((response) => (response.data.AccessToken ? response.data.AccessToken : null)),
      catchError(() => of(null)),
    );
  }

  public logout(): Observable<void> {
    return toObservable(this.api.logout()).pipe(map(() => undefined));
  }

  public getCurrentUser(): Observable<UserDto> {
    const userApi = getUserApi(this.api);
    return toObservable(userApi.getCurrentUser()).pipe(map((response) => response.data));
  }

  public getSystemInfo(): Observable<PublicSystemInfo> {
    const systemApi = getSystemApi(this.api);
    return toObservable(systemApi.getPublicSystemInfo()).pipe(map((response) => response.data));
  }

  public search(query: string, userId: string): Observable<SearchHintResult> {
    const searchApi = getSearchApi(this.api);

    return toObservable(
      searchApi.getSearchHints({
        searchTerm: query,
        userId,
        includeItemTypes: ['Movie', 'Series'],
      }),
    ).pipe(map((response) => response.data));
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
    return `${environment.jellyfin.baseUrl}/Items/${itemId}/Images/Primary?tag=${tag}&quality=${quality}&fillHeight=${fillHeight}&fillWidth=${fillWidth}`;
  }
}
