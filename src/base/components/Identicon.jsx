import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Blockies from 'react-blockies';

const styles = {
  icon: {
    overflow: 'hidden',
    borderRadius: '50%'
  }
};

function Identicon({ classes, publicKey, size, style }) {
  return (
    <div className={classes.icon} style={{ width: size, height: size, ...style }}>
      <Blockies seed={publicKey} size={8} scale={Math.ceil(size / 8)} />
    </div>
  )
}

Identicon.propTypes = {
  classes: PropTypes.object.isRequired,
  publicKey: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default withStyles(styles)(Identicon)