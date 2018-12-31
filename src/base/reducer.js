import { combineReducers } from 'redux';

import appState from './../appState/reducer';
import account from './../account/reducer';

export default combineReducers({ appState, account });