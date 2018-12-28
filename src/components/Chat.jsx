import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Element, scroller } from 'react-scroll';
import {
  Row, Col, Input, Button,
  InputGroup, InputGroupAddon
} from 'reactstrap';

import ChatsIcon from './ChatsIcon';
import FileIcon from './FileIcon';
import ChatDayDivider from './ChatDayDivider';
import ChatMessage from './ChatMessage';

class Chat extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    onFileDownload: PropTypes.func.isRequired,
    data: PropTypes.object,
    publicKey: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      msg: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSend = this.onSend.bind(this);
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
      this.onSend();
    }
  }

  onSend() {
    const { data, onSend } = this.props;
    onSend(data.key, this.state.msg);
    this.setState({ msg: '' });
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

  render() {
    const {
      data,
      publicKey,
      onFileUpload,
      onFileDownload
    } = this.props;

    if (!data || !data.key) {
      return (
        <div className='d-flex justify-content-center h-100'>
          <ChatsIcon fill='#ccc' style={{ width: 92, height: 'auto' }} />
        </div>
      );
    }

    const messages = Object.values(data.messages);

    return (
      <div className='h-100 d-flex flex-column pt-3'>
        <Element
          id='scroll-container'
          className='flex-grow-1'
          style={{ overflowX: 'hidden', overflowY: 'auto' }}>
          <Row>
            {
              messages
                .map((m, i) => {
                  const sender = data.participants[m.sender];
                  const date = new Date(m.timestamp);
                  const showDayDivider = i === 0 || !this.isSameDay(date, new Date(messages[i - 1].timestamp));
                  return (
                    <Fragment key={i}>
                      {showDayDivider ? <ChatDayDivider date={date} /> : null}
                      <Col sm={12}>
                        <ChatMessage
                          message={m}
                          sender={sender}
                          isOwn={sender === publicKey}
                          showHeader={this.showMsgHeader(i, m, i > 0 ? messages[i - 1] : null) || showDayDivider}
                          onDownload={onFileDownload} />
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
            <InputGroup>
              <Input
                value={this.state.msg}
                onChange={this.onChange}
                onKeyPress={this.onKeyPress}
                autoFocus />
              <InputGroupAddon addonType='append'>
                <input
                  type='file'
                  name='file'
                  id='file'
                  className='inputfile'
                  onChange={(e) => onFileUpload(e, data.key)} />
                <label htmlFor='file'>
                  <FileIcon />
                </label>
                <Button
                  color='secondary'
                  onClick={this.onSend}
                  disabled={!this.state.msg}>Send</Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Chat;