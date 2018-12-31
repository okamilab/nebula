import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import Header from './../components/Header';
import Account from './../../account/components/Account';

export default function Layout({ account, children }) {
  return (
    <Container fluid className='d-flex flex-column h-100'>
      <Header />
      <Account />
      {children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};