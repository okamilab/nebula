import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Chat extends Component {
  static propTypes = {
    selected: PropTypes.object,
  };

  render() {
    const { selected } = this.props;
    return (
      <div className='pt-3'>
        {selected ? <div>{selected.key}</div> : null}
      </div>
    );
  }
}

export default Chat;