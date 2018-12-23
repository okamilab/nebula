import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Account extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className='pt-3 text-truncate' onClick={this.props.onClick}>
        {this.props.account.publicKey}
      </div>
    );
  }
}

export default Account;