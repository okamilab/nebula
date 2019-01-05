import { DEFAULT_SETTINGS } from './../base/redux';

export const SETTINGS_MUTATE = 'SETTINGS_MUTATE';

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