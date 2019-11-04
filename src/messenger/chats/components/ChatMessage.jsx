import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Emoji from 'react-emoji-render';

import Identicon from './../../../base/components/Identicon';
import { download } from './../actions';

const styles = theme => ({
  file: {
    backgroundColor: '#f1f1f4',
    display: 'inline-block',
    padding: 10,
    borderRadius: 6
  },
  fileName: {
    paddingTop: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  actionBar: {
    textAlign: 'center',
    paddingBottom: theme.spacing(1)
  },
  block: {
    textAlign: 'left',
    paddingTop: 2
  },
  owned: {
    textAlign: 'right',
    paddingRight: 10
  },
  layout: {
    display: 'flex'
  },
  content: {
    paddingLeft: theme.spacing(1)
  },
  header: {
    fontSize: 12,
    color: '#bbb'
  },
  body: {
    backgroundColor: '#f2f6f9',
    display: 'inline-block',
    padding: '2px 10px',
    marginRight: 10,
    borderRadius: 6,
    textAlign: 'left'
  },
  ownedBody: {
    backgroundColor: '#dbf4fd',
    marginRight: 0,
    marginLeft: 40
  }
});

class ChatMessage extends Component {
  renderMessageContent() {
    const { classes, message, isOwn } = this.props;
    const { text } = message;

    switch (text.startsWith('bzz:/')) {
      case true:
        return (
          <div className={classes.file}>
            <div className={classes.fileName}>File: {text.substr(5, 15)}...</div>
            <hr className={classes.divider} />
            <div className={classes.actionBar}>
              <Button onClick={() => this.download(text.substr(5))}>
                Download
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className={`${classes.body} ${isOwn ? classes.ownedBody : null}`}>
            <Emoji svg='true' text={message.text} />
          </div>
        );
    }
  }

  renderMessage() {
    const { classes, message, sender, isOwn, showHeader } = this.props;
    const time = new Date(message.timestamp);
    let header;

    switch (isOwn) {
      case true:
        if (showHeader) {
          header = (
            <div className={classes.header}>
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
            <div className={classes.header}>
              {username || `${key.substr(0, 8)}...`}, {time.toLocaleTimeString()}
            </div>
          );
        }
        return (
          <div className={classes.layout}>
            {identicon}
            <div className={classes.content}>
              {header}
              {this.renderMessageContent()}
            </div>
          </div>
        );
    }
  }

  render() {
    const { classes, isOwn } = this.props;

    return (
      <div className={`${classes.block} ${isOwn ? classes.owned : null}`}>
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
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  sender: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool.isRequired,
};

export default compose(
  connect(),
  withStyles(styles)
)(ChatMessage);