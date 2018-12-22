import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Chat extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  render() {
    const { data } = this.props;
    if (!data) {
      return <div>NaN</div>;
    }

    return (
      <div className='pt-3'>
        {data.messages.map((c, i) => <div key={i}>{c.text}</div>)}
      </div>
    );
  }
}

export default Chat;