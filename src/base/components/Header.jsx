import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Navbar,
  NavbarBrand,
} from 'reactstrap';

import logo from './../images/logo.png';

class Header extends Component {
  render() {
    return (
      <Row className='flex-shrink-0 header'>
        <Navbar expand='md' className='w-100'>
          <NavbarBrand href='/'>
            <img src={logo} alt='Swarm Messenger'></img>
            <span className='pl-3 text-white'>Swarm Messenger</span>
          </NavbarBrand>
        </Navbar>
      </Row>
    );
  }
}

export default connect()(Header);