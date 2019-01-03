import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withJob } from 'react-jobs';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import Identicon from './../../base/components/Identicon';
import GearIcon from './../../base/components/GearIcon';
import { fetchAccount } from './../actions';

class Account extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    account: PropTypes.object,
  };

  render() {
    const { account } = this.props;
    if (!account) {
      return <div>Loading</div>
    }

    const { username, publicKey } = account;
    return (
      <div
        className='pt-3'
        style={{ cursor: 'pointer' }}>
        <div>
          <Button
            className='btn-primary-outline text-primary d-flex flex-row p-0'
            tag={Link} to='/profile'>
            <div>
              {
                publicKey ?
                  <Identicon publicKey={publicKey} size={48} /> :
                  null
              }
            </div>
            <div
              className='flex-grow-1 pl-2 text-truncate font-weight-bold'
              style={{ lineHeight: '48px' }}>
              {username || publicKey}
            </div>
          </Button>
        </div>
        <div>
          <Button className='btn-primary-outline p-2' tag={Link} to='/settings'>
            <GearIcon />
          </Button>
        </div>
      </div>
    );
  }
}

export default compose(
  connect((state) => {
    const { account } = state || {
      account: {
        publicKey: '',
        username: ''
      }
    };
    return { account };
  }),
  withJob({
    work: ({ dispatch }) => dispatch(fetchAccount()),
  })
)(Account);