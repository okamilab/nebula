import React from 'react';

import logo from './../../images/logo.svg';

export default function Home() {
  return (
    <div className='d-flex align-items-center h-100'>
      <div className='center'>
        <img src={logo} alt='Nebula' className='home-logo' />
      </div>
    </div>
  );
}