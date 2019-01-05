export const ERROR_CATCHED = 'ERROR_CATCHED';
export const ERROR_DISMISS = 'ERROR_DISMISS';

export function addError(error) {
  return async (dispatch) => {
    dispatch({ type: ERROR_CATCHED, error });
  };
}

export function dismissError(error) {
  return async (dispatch) => {
    dispatch({ type: ERROR_DISMISS, error });
  };
}