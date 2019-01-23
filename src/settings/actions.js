import { DEFAULT_SETTINGS } from '../base/default';

export const SETTINGS_MUTATE = 'SETTINGS_MUTATE';

export function updateSettings({ pss, bzz, revealAddress }) {
  return async (dispatch) => {
    dispatch({
      type: SETTINGS_MUTATE,
      settings: { pss, bzz, revealAddress }
    });
  };
}

export function resetSettings() {
  return async (dispatch) => {
    dispatch({
      type: SETTINGS_MUTATE,
      settings: {
        pss: DEFAULT_SETTINGS.pss,
        bzz: DEFAULT_SETTINGS.bzz,
        revealAddress: DEFAULT_SETTINGS.revealAddress
      }
    });
  };
}