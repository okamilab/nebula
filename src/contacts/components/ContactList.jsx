import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ContactInvite from './ContactInvite';

class ContactList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contacts: PropTypes.object,
  };

  render() {
    return (
      <div className='pt-3'>
        <h5>
          All
          <ContactInvite />
        </h5>
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