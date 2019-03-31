import * as api from './../api/account';
import { restoreContacts } from './../contacts/actions';
import { restoreChats } from './../chats/actions';
import { addError } from './../base/error/actions';

export const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST';
export const ACCOUNT_RECEIVE = 'ACCOUNT_RECEIVE';
export const ACCOUNT_MUTATE = 'ACCOUNT_MUTATE';

export function fetchAccount() {
  return async (dispatch, getState, resolve) => {
    dispatch({ type: ACCOUNT_REQUEST });

    try {
      const { client } = resolve();
      const account = await api.fetchAccount(client);
      const { app } = getState();
      const session = app[account.publicKey] || {};
      dispatch(receiveAccount({ ...account, username: session.username }));

      dispatch(restoreContacts(account.publicKey));
      dispatch(restoreChats(account.publicKey));
    } catch (error) {
      dispatch(addError(error.message));
    }
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