import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Identicon from './Identicon';

class ChatList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onStartChat: PropTypes.func.isRequired
  };

  render() {
    const { list, onStartChat } = this.props;
    return (
      <div className='pt-3'>
        <h5>Chats</h5>
        {
          list.map((c, i) =>
            <div
              key={i}
              style={{ cursor: 'pointer' }}
              onClick={() => { onStartChat(c); }}>
              <div className="d-flex flex-row pt-2">
                <div>
                  <Identicon publicKey={c.key} size={32} />
                </div>
                <div
                  className='pl-2 text-truncate'
                  style={{ lineHeight: '32px' }}>
                  {c.key}
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default ChatList;