import React, { Component } from 'react';

import logo from './../images/logo.svg';

export default class Home extends Component {
  render() {
    return (
      <div className='h-100 d-flex align-items-center'>
        <div style={{ margin: '0 auto' }}>
          <img src={logo} alt='Swarm Messenger' style={{ width: 300 }} />
        </div>
      </div>
    );
  }
}