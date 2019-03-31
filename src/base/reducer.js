import { combineReducers } from 'redux';

import app from './../app/reducer';
import account from './../account/reducer';
import settings from './../settings/reducer';
import contacts from './../contacts/reducer';
import chats from './../chats/reducer';
import subscriptions from './../base/subscription/reducer';
import errors from './../base/error/reducer';

export default combineReducers({
  app,
  account,
  settings,
  contacts,
  chats,
  subscriptions,
  errors
});