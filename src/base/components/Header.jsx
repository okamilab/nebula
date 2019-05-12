import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AccountMenu from '../../account/components/AccountMenu';
import logo from './../../images/logo.svg';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    color: 'inherit'
  },
  logo: {
    width: 36,
    marginRight: theme.spacing.unit * 2,
  }
});

function Header({ classes }) {
  return (
    <AppBar position="absolute" color="default">
      <Toolbar>
        <Typography variant="h5" color="inherit" noWrap className={classes.grow}>
          <Link to='/'
            className={classes.title}
            style={{ textDecoration: 'none' }}>
            <img src={logo} alt='Nebula' className={classes.logo} />
            Nebula
          </Link>
        </Typography>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(),
  withStyles(styles)
)(Header);