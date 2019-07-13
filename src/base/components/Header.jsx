import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AccountMenu from './../../account/components/AccountMenu';
import ControlPanelButton from './../../messenger/components/ControlPanelButton';
import logo from './../../images/logo.svg';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    color: 'inherit',
    lineHeight: '2.4rem'
  },
  logo: {
    width: 36,
    marginRight: theme.spacing(2),
    display: 'block',
    float: 'left'
  }
});

function Header({ classes, isNarrow }) {
  return (
    <AppBar color="default">
      <Toolbar>
        {isNarrow && <ControlPanelButton />}
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
  isNarrow: PropTypes.bool
};

export default withStyles(styles)(Header);