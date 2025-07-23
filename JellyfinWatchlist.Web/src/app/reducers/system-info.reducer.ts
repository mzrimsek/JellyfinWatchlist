import { createFeature, createReducer, on } from '@ngrx/store';

import { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models';
import { SystemInfoActions } from '../actions/system-info.actions';

export interface State {
  publicSystemInfo: PublicSystemInfo | null;
  loading: boolean;
}

const initialState: State = {
  publicSystemInfo: null,
  loading: false,
};

export const systemInfoReducer = createReducer(
  initialState,
  on(
    SystemInfoActions.get,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    SystemInfoActions.getSucceeded,
    (state, { systemInfo }): State => ({
      ...state,
      publicSystemInfo: systemInfo,
      loading: false,
    }),
  ),
  on(
    SystemInfoActions.getFailed,
    (state): State => ({
      ...state,
      publicSystemInfo: null,
      loading: false,
    }),
  ),
);

const systemInfoFeature = createFeature({
  name: 'systemInfo',
  reducer: systemInfoReducer,
});

export const { name, reducer, selectSystemInfoState, selectPublicSystemInfo, selectLoading } =
  systemInfoFeature;
