import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

import LeftSide from './LeftSide';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0
  },
  cell: {
    margin: 0,
    padding: 0,
    height: '100%'
  }
};

function Layout({ classes, children, isNarrow }) {
  return (
    <Grid container spacing={0} className={classes.container}>
      {
        !isNarrow && <Grid item xs={3} className={classes.cell}>
          <LeftSide />
        </Grid>
      }
      <Grid item xs={isNarrow ? 12 : 9} className={classes.cell}>
        {children}
      </Grid>
    </Grid>
  );
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  isNarrow: PropTypes.bool
};

export default withStyles(styles)(Layout);