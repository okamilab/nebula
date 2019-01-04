import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Navbar,
  NavbarBrand,
} from 'reactstrap';

import logo from './../images/logo.svg';
import gear from './../images/gear.svg';

class Header extends Component {
  render() {
    return (
      <Row className='flex-shrink-0 header'>
        <Navbar expand='md' className='w-100 justify-content-between'>
          <NavbarBrand tag={Link} to='/'>
            <img src={logo} alt='Swarm Messenger' style={{ width: 36 }} />
            <span className='pl-3 text-white'>Swarm Messenger</span>
          </NavbarBrand>
          <Link to='/settings'>
            <img src={gear} alt='Settings' style={{ width: 32 }} />
          </Link>
        </Navbar>
      </Row>
    );
  }
}

export default connect()(Header);