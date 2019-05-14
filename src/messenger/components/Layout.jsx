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

function Layout({ classes, children }) {
  return (
    <Grid container spacing={0} className={classes.container}>
      <Grid item sm={3} xs={4} className={classes.cell}>
        <LeftSide />
      </Grid>
      <Grid item sm={9} xs={8} className={classes.cell}>
        {children}
      </Grid>
    </Grid>
  );
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default withStyles(styles)(Layout);