import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './../components/Header';
import Error from './../error/components/Error';
import WsConnection from './../components/WsConnection';

const styles = theme => ({
  layout: {
    height: '100%',
    paddingTop: 64
  }
});

function Layout({ classes, children }) {
  return (
    <>
      <CssBaseline />
      <Header />
      <main className={classes.layout}>{children}</main>
      <Error />
      <WsConnection />
    </>
  );
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default withStyles(styles)(Layout);