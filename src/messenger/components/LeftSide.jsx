import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import ControlPanel from './ControlPanel';

const styles = {
  root: {
    flexGrow: 1,
    maxWidth: 500,
    height: '100%'
  },
};

function LeftSide({ classes }) {
  return (
    <Paper square className={classes.root}>
      <ControlPanel />
    </Paper>
  );
}

LeftSide.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LeftSide);