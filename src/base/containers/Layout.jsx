import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import Header from './../components/Header';

export default function Layout({ children }) {
  return (
    <Container fluid className='d-flex flex-column h-100'>
      <Header />
      {children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};
