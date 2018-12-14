import React, { Component } from 'react';

import ContactInvite from './ContactInvite';

class ContactList extends Component {
  render() {
    return (
      <div className="pt-3">
        <h5>Contacts</h5>
        <ContactInvite onRequest={this.props.onContactRequest}/>
      </div>
    );
  }
}

export default ContactList;