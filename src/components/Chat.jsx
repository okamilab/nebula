import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChatsIcon from './ChatsIcon';

class Chat extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  render() {
    const { data } = this.props;
    if (!data || !data.key) {
      return (
        <div className='d-flex justify-content-center h-100'>
          <ChatsIcon fill='#ccc' style={{ width: 92, height: 'auto' }} />
        </div>
      );
    }

    return (
      <div className='pt-3'>
        {
          Object.values(data.messages)
            .map((c, i) => <div key={i}>{c.text}</div>)
        }
      </div>
    );
  }
}

export default Chat;