import * as SystemInfoActions from '../actions/system-info.actions';

import { createFeature, createReducer, on } from '@ngrx/store';

import { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models';

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
  on(SystemInfoActions.getSystemInfo, (state) => ({
    ...state,
    loading: true,
  })),
  on(SystemInfoActions.getSystemInfoSucceeded, (state, { systemInfo }) => ({
    ...state,
    publicSystemInfo: systemInfo,
    loading: false,
  })),
  on(SystemInfoActions.getSystemInfoFailed, (state) => ({
    ...state,
    publicSystemInfo: null,
    loading: false,
  }))
);

const systemInfoFeature = createFeature({
  name: 'systemInfo',
  reducer: systemInfoReducer,
});

export const {
  name,
  reducer,
  selectSystemInfoState,
  selectPublicSystemInfo,
  selectLoading,
} = systemInfoFeature;
