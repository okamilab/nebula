import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import { Message } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import logo from './../../images/logo.svg';

const styles = theme => ({
  logoContainer: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 10,
    paddingBottom: theme.spacing.unit * 8,
  },
  logo: {
    width: 200,
    paddingBottom: theme.spacing.unit * 2,
  },
  title: {
    color: '#e3e3e3'
  },
  apps: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 8,
  },
  app: {
    width: 100,
    textAlign: 'center',
    paddingLeft: theme.spacing.unit * 8,
    paddingRight: theme.spacing.unit * 8,
  },
  appIcon: {
    fontSize: 100
  }
});

function Home({ classes }) {
  return (
    <>
      <div className={classes.logoContainer}>
        <img src={logo} alt='Nebula' className={classes.logo} />
        <Typography variant='h1' className={classes.title}>Nebula</Typography>
      </div>
      <div className={classes.apps}>
        <Button
          component={Link}
          to='/messenger'
          className={classes.app}>
          <Typography>
            <Message className={classes.appIcon} />
            Messenger
          </Typography>
        </Button>
        <Button
          component={Link}
          to='/browser'
          className={classes.app}>
          <Typography>
            <Message className={classes.appIcon} />
            Browser
          </Typography>
        </Button>
      </div>
    </>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);