import { combineReducers } from 'redux';

import appState from './../appState/reducer';
import account from './../account/reducer';
import settings from './../settings/reducer';
import contacts from './../contacts/reducer';
import chats from './../chats/reducer';

export default combineReducers({ appState, account, settings, contacts, chats });