import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Identicon from './../common/Identicon';
import Gear from './GearIcon';

class Account extends Component {
  static propTypes = {
    onSettingsClick: PropTypes.func.isRequired,
    onProfileClick: PropTypes.func.isRequired,
    account: PropTypes.object,
    username: PropTypes.string,
  };

  render() {
    const {
      account,
      username,
      onSettingsClick,
      onProfileClick
    } = this.props;

    return (
      <div
        className='pt-3'
        style={{ cursor: 'pointer' }}>
        <div className='d-flex flex-row'>
          <div onClick={onProfileClick}>
            {
              account.publicKey ?
                <Identicon publicKey={account.publicKey} size={48} /> :
                null
            }
          </div>
          <div
            className='flex-grow-1 pl-2 text-truncate font-weight-bold'
            style={{ lineHeight: '48px' }}
            onClick={onProfileClick}>
            {
              username && username.length ?
                username :
                account.publicKey
            }
          </div>
          <div
            className='pl-2 pt-2'
            onClick={onSettingsClick}>
            <Gear />
          </div>
        </div>
      </div>
    );
  }
}

export default Account;