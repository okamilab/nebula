import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import {  Row, Col} from 'reactstrap';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { Description, Send } from '@material-ui/icons';
import sum from 'hash-sum';

import Layout from './../../components/Layout';
import ChatDayDivider from './../components/ChatDayDivider';
import ChatMessage from './../components/ChatMessage';
import { sendMessage, sendFile } from './../actions';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  file: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1',
    cursor: 'pointer',
  },
  fileLabel: {
    margin: 0,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = { msg: '' };

    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    scroller.scrollTo('bottom', {
      duration: 400,
      delay: 0,
      smooth: 'easeInOutQuart',
      containerId: 'scroll-container'
    });
  }

  onChange(e) {
    this.setState({
      msg: e.target.value
    });
  }

  onKeyPress(e) {
    if (e.key === 'Enter' && this.state.msg) {
      this.send();
    }
  }

  isSameDay(curTime, prevTime) {
    return curTime.getDay() === prevTime.getDay();
  }

  showMsgHeader(index, curMsg, prevMsg) {
    if (index === 0) {
      return true;
    }

    if (curMsg.sender !== prevMsg.sender) {
      return true;
    }

    return false;
  }

  getParticipants() {
    const { chat, account, contacts } = this.props;
    const { publicKey } = account;

    const participants = {
      [sum(publicKey)]: { key: publicKey }
    };

    Object.keys(chat.participants)
      .forEach(k => {
        const contact = contacts[k];
        if (!contact) {
          return;
        }
        participants[k] = contacts[k];
      });

    return participants;
  }

  render() {
    const { classes, chat, account } = this.props;
    if (!chat) {
      return <div>Chat not found</div>
    }

    const participants = this.getParticipants();
    const messages = Object.values(chat.messages)
      .sort((a, b) => a.timestamp - b.timestamp);
    const { publicKey } = account;

    return (
      <Layout>
        <Row className='h-100'>
          <Col className='h-100'
            xl={{ size: 8, offset: 2 }}
            lg={{ size: 10, offset: 1 }}>
            <div className='h-100 d-flex flex-column pt-3'>
              <Element id='scroll-container'
                className='flex-grow-1 chat-container'>
                <Row>
                  {
                    messages
                      .map((m, i) => {
                        const sender = participants[m.sender];
                        const date = new Date(m.timestamp);
                        const showDayDivider = i === 0 || !this.isSameDay(date, new Date(messages[i - 1].timestamp));
                        return (
                          <Fragment key={i}>
                            {showDayDivider ? <ChatDayDivider date={date} /> : null}
                            <Col sm={12}>
                              <ChatMessage
                                message={m}
                                sender={sender}
                                isOwn={sender.key === publicKey}
                                showHeader={this.showMsgHeader(i, m, i > 0 ? messages[i - 1] : null) || showDayDivider} />
                            </Col>
                          </Fragment>
                        )
                      })
                  }
                </Row>
                <Element name="bottom"></Element>
              </Element>
              <Row className='flex-shrink-0 pt-3 pb-3'>
                <Col>
                  <Paper className={classes.root} elevation={1}>
                    <InputBase
                      className={classes.input}
                      placeholder="Type a message here"
                      value={this.state.msg}
                      onChange={this.onChange}
                      onKeyPress={this.onKeyPress}
                      autoFocus />
                    <input
                      type='file'
                      name='file'
                      id='file'
                      className={classes.file}
                      onChange={this.upload}
                    />
                    <label htmlFor='file' className={classes.fileLabel}>
                      <IconButton className={classes.iconButton} component="span">
                        <Description />
                      </IconButton>
                    </label>
                    <Divider className={classes.divider} />
                    <IconButton
                      className={classes.iconButton}
                      onClick={this.send}
                      disabled={!this.state.msg}>
                      <Send />
                    </IconButton>
                  </Paper>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }

  send = () => {
    const { id } = this.props;
    this.props.dispatch(sendMessage(id, this.state.msg));
    this.setState({ msg: '' });
  };

  upload = (e) => {
    if (!e.target.files.length) {
      return;
    }

    const { id } = this.props;
    this.props.dispatch(sendFile(id, e.target.files[0]));
  }
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string,
  chat: PropTypes.object,
  account: PropTypes.object,
};

export default compose(
  connect((state, props) => {
    const { chats, account, contacts } = state || {
      chats: [],
      account: {},
      contacts: {}
    };
    const key = props.match.params.key;
    return {
      id: key,
      chat: chats.find(c => c.key === key),
      account,
      contacts
    };
  }),
  withStyles(styles)
)(withRouter(Chat));