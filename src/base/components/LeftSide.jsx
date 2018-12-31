import React, { Fragment } from 'react';

import Account from './../../account/components/Account';
import ContactList from './../../contacts/components/ContactList';

export default function LeftSide() {
  return (
    <Fragment>
      <Account />
      <ContactList />
    </Fragment>
  )
}