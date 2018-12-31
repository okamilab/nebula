export const CONTACTS_RESTORE = 'SETTINGS_RESTORE';

export function restoreContacts(publicKey) {
  return async (dispatch, getState) => {
    const { appState } = getState();
    const contacts = appState[publicKey].contacts;
    dispatch({
      type: CONTACTS_RESTORE,
      contacts
    });
  };
}