import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Identicon from './../../base/components/Identicon';

class ChatList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    chats: PropTypes.array,
  };

  render() {
    const { chats } = this.props;

    return (
      <div className='pt-3'>
        <h5>Chats</h5>
        {
          chats.map((c, i) =>
            <Link
              key={i}
              className='btn-primary-outline text-primary text-left d-flex flex-row p-2 pl-0'
              to={'/chat/' + c.key}>
              <div>
                <Identicon publicKey={c.key} size={32} />
              </div>
              <div
                className='pl-2 text-truncate'
                style={{ lineHeight: '32px' }}>
                {c.key}
              </div>
            </Link>
          )
        }
      </div>
    );
  }
}

export default compose(
  connect((state) => {
    const { chats } = state || [];
    return { chats };
  })
)(ChatList);