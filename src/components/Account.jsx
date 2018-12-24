import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Identicon from './Identicon';

class Account extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    account: PropTypes.object,
    username: PropTypes.string,
  };

  render() {
    const { account, username, onClick } = this.props;

    return (
      <div
        className='pt-3'
        style={{ cursor: 'pointer' }}
        onClick={onClick}>
        <div className='d-flex flex-row'>
          <div>
            {
              account.publicKey ?
                <Identicon publicKey={account.publicKey} size={48} /> :
                null
            }
          </div>
          <div
            className='pl-2 text-truncate font-weight-bold'
            style={{ lineHeight: '48px' }}>
            {
              username && username.length ?
                username :
                account.publicKey
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Account;