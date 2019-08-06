import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Element, scroller } from 'react-scroll';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';
import sum from 'hash-sum';

import Layout from './../../components/Layout';
import ChatDayDivider from './../components/ChatDayDivider';
import ChatMessage from './../components/ChatMessage';
import { sendMessage, sendFile } from './../actions';

const styles = theme => ({
  scrollContainer: {
    height: '100%',
    overflow: 'scroll'
  },
  list: {
    paddingBottom: 80
  },
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginRight: theme.spacing(2),
    padding: '2px 4px',
    display: 'flex'
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
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 4,
  },
  fixed: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
  }
});

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
    const { classes, isNarrow, chat, account } = this.props;
    if (!chat) {
      return <div>Chat not found</div>
    }

    const participants = this.getParticipants();
    const messages = Object.values(chat.messages)
      .sort((a, b) => a.timestamp - b.timestamp);
    const { publicKey } = account;

    return (
      <>
        <Layout isNarrow={isNarrow}>
          <Element id='scroll-container' className={classes.scrollContainer}>
            <Grid
              container
              spacing={0}
              justify='center'
            >
              <Grid item xs={10} lg={10} xl={8} className={classes.list}>
                {
                  messages
                    .map((m, i) => {
                      const sender = participants[m.sender];
                      const date = new Date(m.timestamp);
                      const showDayDivider = i === 0 || !this.isSameDay(date, new Date(messages[i - 1].timestamp));
                      return (
                        <Fragment key={i}>
                          {showDayDivider ? <ChatDayDivider date={date} /> : null}
                          <div>
                            <ChatMessage
                              message={m}
                              sender={sender}
                              isOwn={sender.key === publicKey}
                              showHeader={this.showMsgHeader(i, m, i > 0 ? messages[i - 1] : null) || showDayDivider} />
                          </div>
                        </Fragment>
                      )
                    })
                }
                <Element name='bottom'></Element>
              </Grid>
            </Grid>
          </Element>
        </Layout>
        <div className={classes.fixed}>
          <Grid container spacing={0}>
            {
              !isNarrow && <Grid item sm={3}></Grid>
            }
            <Grid item xs={isNarrow ? 12 : 9}>
              <Grid
                container
                spacing={0}
                justify='center'
              >
                <Grid item xs={10} lg={10} xl={8}>
                  <Paper className={classes.root} elevation={1}>
                    <InputBase
                      className={classes.input}
                      placeholder='Type a message here'
                      value={this.state.msg}
                      onChange={this.onChange}
                      onKeyPress={this.onKeyPress}
                      autoFocus />
                    {/* <input
                      type='file'
                      name='file'
                      id='file'
                      className={classes.file}
                      onChange={this.upload}
                    />
                    <label htmlFor='file' className={classes.fileLabel}>
                      <IconButton className={classes.iconButton} component='span'>
                        <Description />
                      </IconButton>
                    </label>
                    <Divider className={classes.divider} /> */}
                    <IconButton
                      className={classes.iconButton}
                      onClick={this.send}
                      disabled={!this.state.msg}>
                      <Send />
                    </IconButton>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </>
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
  isNarrow: PropTypes.bool,
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
    const hash = props.match.params.key;
    return {
      id: hash,
      chat: chats[hash],
      account,
      contacts
    };
  }),
  withStyles(styles)
)(Chat);