import { combineReducers } from 'redux';

import appState from './../appState/reducer';
import account from './../account/reducer';
import settings from './../settings/reducer';
import contacts from './../contacts/reducer';
import chats from './../chats/reducer';
import subscriptions from './../base/subscription/reducer';
import errors from './../base/error/reducer';

export default combineReducers({
  appState,
  account,
  settings,
  contacts,
  chats,
  subscriptions,
  errors
});