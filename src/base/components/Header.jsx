import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { push } from 'connected-react-router';

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

function Header({ classes, dispatch, isNarrow }) {
  return (
    <AppBar color='default'>
      <Toolbar>
        {isNarrow && <ControlPanelButton />}
        <Typography variant='h5' color='inherit' noWrap className={classes.grow}>
          <ButtonBase
            className={classes.title}
            style={{ textDecoration: 'none' }}
            onClick={() => { dispatch(push('/')) }}>
            <img src={logo} alt='Nebula' className={classes.logo} />
            <Typography variant='h5' color='inherit' noWrap>Nebula</Typography>
          </ButtonBase>
        </Typography>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isNarrow: PropTypes.bool
};

export default compose(
  connect(),
  withStyles(styles)
)(Header);