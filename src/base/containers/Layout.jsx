import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import Header from './../components/Header';
import Error from './../error/components/Error';
import LeftSide from './../components/LeftSide';
import WsConnection from './../components/WsConnection';

export default function Layout({ children }) {
  return (
    <Fragment>
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
      <Error />
      <WsConnection />
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};