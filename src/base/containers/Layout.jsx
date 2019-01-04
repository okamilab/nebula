import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import Header from './../components/Header';
import LeftSide from './../components/LeftSide';

export default function Layout({ children }) {
  return (
    <Container fluid className='d-flex flex-column h-100'>
      <Header />
      <Row className='flex-grow-1'>
        <Col xl={3} lg={3} md={4} style={{ borderRight: '1px solid #eee' }}>
          <LeftSide />
        </Col>
        <Col xl={9} lg={9} md={8}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};