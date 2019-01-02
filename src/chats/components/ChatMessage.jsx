import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import Identicon from './../../base/components/Identicon';
import { download } from './../actions';

const styles = {
  container: {
    own: {
      textAlign: 'right',
      paddingRight: 10,
      paddingTop: 2
    },
    rest: {
      textAlign: 'left',
      paddingTop: 2
    }
  },
  message: {
    own: {
      backgroundColor: '#dbf4fd',
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 6
    },
    rest: {
      backgroundColor: '#f2f6f9',
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 6
    }
  }
}

class ChatMessage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
    sender: PropTypes.object.isRequired,
    isOwn: PropTypes.bool.isRequired,
    showHeader: PropTypes.bool.isRequired,
  };

  renderMessageContent() {
    const { message, isOwn } = this.props;
    const { text } = message;
    const { own, rest } = styles.message;
    const messageStyles = isOwn ? own : rest;

    switch (text.startsWith('bzz:/')) {
      case true:
        return (
          <div style={{
            backgroundColor: '#f1f1f4',
            display: 'inline-block',
            padding: 10,
            borderRadius: 6
          }}>
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
          <div style={messageStyles}>
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
            <div style={{ fontSize: 12, color: '#bbb' }} >
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
            <div style={{ fontSize: 12, color: '#bbb' }} >
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
    const { own, rest } = styles.container;
    const containerStyles = isOwn ? own : rest;

    return (
      <div style={containerStyles}>
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

export default compose(connect())(ChatMessage);