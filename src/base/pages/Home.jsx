import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { Message } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';

import logo from './../../images/logo.svg';

const styles = theme => ({
  logoContainer: {
    textAlign: 'center',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(8),
  },
  logo: {
    width: 200,
    paddingBottom: theme.spacing(2),
  },
  title: {
    color: '#e3e3e3'
  },
  apps: {
    textAlign: 'center',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(8),
  },
  app: {
    width: 100,
    textAlign: 'center',
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
  },
  appIcon: {
    fontSize: 100
  }
});

function Home({ classes, dispatch }) {
  return (
    <>
      <div className={classes.logoContainer}>
        <img src={logo} alt='Nebula' className={classes.logo} />
        <Typography variant='h1' className={classes.title}>Nebula</Typography>
      </div>
      <div className={classes.apps}>
        <Button
          className={classes.app}
          onClick={() => { dispatch(push('/messenger')) }}>
          <Typography>
            <Message className={classes.appIcon} />
            Messenger
          </Typography>
        </Button>
      </div>
    </>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default compose(
  connect(),
  withStyles(styles)
)(Home);