import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContactInvite from './ContactInvite';
import ContactListGroup from './ContactListGroup';
import ContactRequest from './ContactRequest';
import Identicon from './../common/Identicon';
import { groupBy } from '../../base/fn';

class ContactList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onContactRequest: PropTypes.func.isRequired,
    onAcceptContact: PropTypes.func.isRequired,
    onDeclineContact: PropTypes.func.isRequired,
    onStartChat: PropTypes.func.isRequired,
    onOpenInfo: PropTypes.func.isRequired,
  };

  render() {
    const {
      list,
      onContactRequest,
      onAcceptContact,
      onDeclineContact,
      onStartChat,
      onOpenInfo
    } = this.props;
    const map = groupBy(list, 'type');

    return (
      <div className='pt-3'>
        <h5>
          All
          <ContactInvite onRequest={onContactRequest} />
        </h5>
        <ContactListGroup list={map['sent_request']} title='Sent' />
        <ContactListGroup
          list={map['received_request']}
          title='Received'
          renderItem={(c, i) => <ContactRequest
            key={i}
            value={c.key}
            onAccept={onAcceptContact}
            onDecline={onDeclineContact}>
          </ContactRequest>}>
        </ContactListGroup>
        <ContactListGroup
          list={map['added']}
          renderItem={(c, i) =>
            <div
              key={i}
              style={{ cursor: 'pointer' }}>
              <div className="d-flex flex-row pt-2">
                <div onClick={() => { onStartChat(c); }}>
                  <Identicon publicKey={c.key} size={32} />
                </div>
                <div
                  className='flex-grow-1 pl-2 text-truncate'
                  style={{ lineHeight: '32px' }}
                  onClick={() => { onStartChat(c); }}>
                  {c.username || c.key}
                </div>
                <div onClick={() => { onOpenInfo(c.key) }}>. . .</div>
              </div>
            </div>
          }>
        </ContactListGroup>
      </div>
    );
  }
}

export default ContactList;
