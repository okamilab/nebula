import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

const ChatDayDivider = ({ date }) => {
  return (
    <Col className='chat-hr'>
      <span>{date.toLocaleDateString()}</span>
    </Col>
  );
}

ChatDayDivider.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
}

export default ChatDayDivider