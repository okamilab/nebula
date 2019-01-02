import React, { Fragment } from 'react';

import Account from './../../account/components/Account';
import ContactList from './../../contacts/components/ContactList';
import ChatList from './../../chats/components/ChatList';

export default function LeftSide() {
  return (
    <Fragment>
      <Account />
      <ContactList />
      <ChatList />
    </Fragment>
  )
}