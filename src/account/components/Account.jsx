import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Identicon from './../../base/components/Identicon';

class Account extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    account: PropTypes.object,
    errors: PropTypes.array
  };

  render() {
    const { account, errors } = this.props;

    if (errors.length) {
      return <Redirect to={'/settings'} />;
    }

    const { username, publicKey } = account;
    return (
      <Fragment>
        {
          publicKey ?
            <div className='w-100 pt-3'>
              <Link to='/profile'>
                <Identicon publicKey={publicKey} size={48} style={{ float: 'left' }} />
                <div className='text-truncate font-weight-bold account'>
                  {username || publicKey}
                </div>
              </Link>
            </div> :
            null
        }
      </Fragment>
    );
  }
}

export default compose(
  connect((state) => {
    const { account, errors } = state || {
      account: {
        publicKey: '',
        username: ''
      },
      errors: []
    };
    return { account, errors };
  })
)(Account);