import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Identicon from './../../../base/components/Identicon';
import { download } from './../actions';

class ChatMessage extends Component {
  renderMessageContent() {
    const { message, isOwn } = this.props;
    const { text } = message;

    switch (text.startsWith('bzz:/')) {
      case true:
        return (
          <div className='chat-msg-file'>
            <div className='pt-2'>File: {text.substr(5, 15)}...</div>
            <hr className='mt-2 mb-2' />
            <div className='text-center pb-2'>
              <Button color='link'
                className='p-0'
                onClick={() => this.download(text.substr(5))}>
                Download
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className={'chat-msg' + (isOwn ? ' own' : '')}>
            {message.text}
          </div>
        );
    }
  }

  renderMessage() {
    const { message, sender, isOwn, showHeader } = this.props;
    const time = new Date(message.timestamp);
    let header;

    switch (isOwn) {
      case true:
        if (showHeader) {
          header = (
            <div className='chat-msg-header'>
              {time.toLocaleTimeString()}
            </div>
          );
        }
        return (
          <Fragment>
            {header}
            {this.renderMessageContent()}
          </Fragment>
        );
      default:
        let identicon = (<div style={{ width: 32 }}></div>);
        const { key, username } = sender;
        if (showHeader) {
          identicon = (
            <div>
              <Identicon publicKey={key} size={32} />
            </div>
          );
          header = (
            <div className='chat-msg-header'>
              {username || key.substr(0, 8) + '...'}, {time.toLocaleTimeString()}
            </div>
          );
        }
        return (
          <div className='d-flex flex-row'>
            {identicon}
            <div className='pl-2'>
              {header}
              {this.renderMessageContent()}
            </div>
          </div>
        );
    }
  }

  render() {
    const { isOwn } = this.props;

    return (
      <div className={'chat-msg-layout' + (isOwn ? ' own' : '')}>
        {this.renderMessage()}
      </div>
    );
  }

  download = (hash) => {
    if (!hash) {
      return;
    }

    this.props.dispatch(download(hash));
  }
}

ChatMessage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  sender: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool.isRequired,
};

export default compose(connect())(ChatMessage);