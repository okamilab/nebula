import React from 'react';
import Blockies from 'react-blockies';

const Identicon = ({ publicKey, size }) => {
  return (
    <div style={{ overflow: 'hidden', borderRadius: '50%', position: 'relative', width: size, height: size }}>
      <Blockies seed={publicKey} size={8} scale={Math.ceil(size / 8)} />
    </div>
  )
}

export default Identicon