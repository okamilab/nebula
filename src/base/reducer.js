import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import app from './../app/reducer';
import account from './../account/reducer';
import settings from './../settings/reducer';
import contacts from './../messenger/contacts/reducer';
import chats from './../messenger/chats/reducer';
import subscriptions from './../base/subscription/reducer';
import errors from './../base/error/reducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  app,
  account,
  settings,
  contacts,
  chats,
  subscriptions,
  errors
});