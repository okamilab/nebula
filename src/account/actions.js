import * as api from './../api/account';
import { restoreSettings } from './../settings/actions';
import { restoreContacts } from './../contacts/actions';
import { restoreChats } from './../chats/actions';

export const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST';
export const ACCOUNT_RECEIVE = 'ACCOUNT_RECEIVE';
export const ACCOUNT_MUTATE = 'ACCOUNT_MUTATE';

export function fetchAccount() {
  return async (dispatch, getState, client) => {
    dispatch({ type: ACCOUNT_REQUEST });

    const account = await api.fetchAccount(client);
    const { appState } = getState();
    const session = appState[account.publicKey] || {};
    dispatch(receiveAccount({ ...account, username: session.username }));

    dispatch(restoreSettings());
    dispatch(restoreContacts(account.publicKey));
    dispatch(restoreChats(account.publicKey));
  };
}

function receiveAccount(account) {
  return {
    type: ACCOUNT_RECEIVE,
    account
  };
}

export function updateUsername(username) {
  return async (dispatch) => {
    dispatch({
      type: ACCOUNT_MUTATE,
      account: { username }
    });
  };
}