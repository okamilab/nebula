import { fetchAccount } from './../account/actions';
import { addError } from './../base/error/actions';

export const APP_CONNECTING = 'APP_CONNECTING';
export const APP_CONNECTED = 'APP_CONNECTED';
export const APP_DISCONNECTED = 'APP_DISCONNECTED';

export function connect() {
  return async (dispatch, _, resolve) => {
    dispatch({ type: APP_CONNECTING });

    const { connection } = resolve();
    connection.subscribe(
      (isConnected) => {
        if (isConnected) {
          dispatch({ type: APP_CONNECTED });
          dispatch(fetchAccount());
        } else {
          dispatch({ type: APP_DISCONNECTED });
        }
      },
      (err) => {
        dispatch(addError(err.message));
      }
    );
  };
}