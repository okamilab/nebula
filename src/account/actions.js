import { restoreContacts } from './../messenger/contacts/actions';
import { restoreChats } from './../messenger/chats/actions';
import { addError } from './../base/error/actions';

export const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST';
export const ACCOUNT_RECEIVE = 'ACCOUNT_RECEIVE';
export const ACCOUNT_MUTATE = 'ACCOUNT_MUTATE';

export function fetchAccount() {
  return async (dispatch, getState, resolve) => {
    dispatch({ type: ACCOUNT_REQUEST });

    try {
      const { client } = resolve();
      const [publicKey, overlayAddress] =
        await Promise.all([
          client.pss.getPublicKey(),
          client.pss.baseAddr(),
        ]);

      const { app } = getState();
      const session = app[publicKey] || {};
      dispatch(receiveAccount({ publicKey, overlayAddress, username: session.username }));

      dispatch(restoreContacts(publicKey));
      dispatch(restoreChats(publicKey));
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