import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

const ChatDayDivider = ({ date }) => {
  return (
    <Col style={{
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
      lineHeight: '0.3em',
      margin: '10px 0 20px'
    }}>
      <span style={{
        background: '#fff',
        padding: '0 6px',
        color: '#bbb',
        fontSize: 12
      }}>
        {date.toLocaleDateString()}
      </span>
    </Col>
  );
}

ChatDayDivider.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
}

export default ChatDayDivider