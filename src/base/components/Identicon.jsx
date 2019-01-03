import React from 'react';
import Blockies from 'react-blockies';

export default function Identicon({ publicKey, size, style }) {
  return (
    <div style={{ overflow: 'hidden', borderRadius: '50%', width: size, height: size, ...style }}>
      <Blockies seed={publicKey} size={8} scale={Math.ceil(size / 8)} />
    </div>
  )
}