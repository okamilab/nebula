import { combineReducers } from 'redux';

import appState from './../appState/reducer';
import account from './../account/reducer';
import settings from './../settings/reducer';

export default combineReducers({ appState, account, settings });