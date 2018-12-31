import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withJob } from 'react-jobs';
import Helmet from 'react-helmet-async';
import {
  Container, Row, Col, Alert, Card, CardTitle
} from 'reactstrap';
import { Redirect } from 'react-router';

import Identicon from './../../base/components/Identicon';
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
        <div className='d-flex flex-row'>
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