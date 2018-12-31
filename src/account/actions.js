import * as api from './../api/account';
import { restoreSettings } from './../settings/actions';

export const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST';
export const ACCOUNT_RECEIVE = 'ACCOUNT_RECEIVE';

export function fetchAccount() {
  return async (dispatch, _, client) => {
    dispatch(requestAccount());
    const account = await api.fetchAccount(client);
    dispatch(receiveAccount(account));
    dispatch(restoreSettings());
  };
}

function requestAccount() {
  return {
    type: ACCOUNT_REQUEST,
  };
}

function receiveAccount(account) {
  return {
    type: ACCOUNT_RECEIVE,
    account
  };
}