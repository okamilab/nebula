import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import sum from 'hash-sum';

import ContactInvite from './ContactInvite';
import ContactListGroup from './ContactListGroup';
import ContactRequest from './ContactRequest';
import Identicon from './../../base/components/Identicon';
import { groupBy } from './../../base/fn';

class ContactList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contacts: PropTypes.object,
  };

  render() {
    const { contacts } = this.props;
    const map = groupBy(Object.values(contacts), 'type');

    return (
      <div className='pt-3'>
        <h5>
          All
          <ContactInvite />
        </h5>
        <ContactListGroup list={map['sent_request']} title='Sent' />
        <ContactListGroup
          list={map['received_request']}
          title='Received'
          renderItem={(c, i) => <ContactRequest key={i} value={c.key} />} />
        <ContactListGroup
          list={map['added']}
          renderItem={(c, i) =>
            <div
              key={i}
              style={{ cursor: 'pointer' }}>
              <Link
                className='btn-primary-outline text-primary text-left d-flex flex-row p-2 pl-0'
                to={'/contact/' + sum(c.key)}>
                <div>
                  <Identicon publicKey={c.key} size={32} />
                </div>
                <div
                  className='flex-grow-1 pl-2 text-truncate'
                  style={{ lineHeight: '32px' }}>
                  {c.username || c.key}
                </div>
              </Link>
            </div>
          }>
        </ContactListGroup>
      </div>
    );
  }
}

export default compose(
  connect((state) => {
    const { contacts } = state || {};
    return { contacts };
  })
)(ContactList);