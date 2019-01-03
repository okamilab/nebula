import { DEFAULT_SETTINGS } from './../base/redux';

export const SETTINGS_RESTORE = 'SETTINGS_RESTORE';
export const SETTINGS_MUTATE = 'SETTINGS_MUTATE';

export function restoreSettings() {
  return async (dispatch, getState) => {
    const { appState } = getState();
    const settings = {
      pss: appState.pss,
      bzz: appState.bzz,
      raw: appState.raw
    };
    dispatch({
      type: SETTINGS_RESTORE,
      settings
    });
  };
}

export function updateSettings({ pss, bzz }) {
  return async (dispatch) => {
    dispatch({
      type: SETTINGS_MUTATE,
      settings: { pss, bzz }
    });
  };
}

export function resetSettings() {
  return async (dispatch) => {
    dispatch({
      type: SETTINGS_MUTATE,
      settings: {
        pss: DEFAULT_SETTINGS.pss,
        bzz: DEFAULT_SETTINGS.bzz
      }
    });
  };
}