export const SETTINGS_RESTORE = 'SETTINGS_RESTORE';

export function restoreSettings(account) {
  return async (dispatch, getState) => {
    const { appState } = getState();
    console.log(account, appState)
    // const settings = await api.fetchAccount(client);
    // dispatch({
    //   type: SETTINGS_RESTORE,
    //   settings
    // });
  };
}