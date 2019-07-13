import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { AccountCircle, Settings } from '@material-ui/icons';

import Identicon from '../../base/components/Identicon';

const styles = _ => ({
  menu: {
    maxWidth: 300,
  },
});

class AccountMenu extends Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, account, errors } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    if (errors.length) {
      return <Redirect to={'/settings'} />;
    }

    const { publicKey, username } = account;
    if (!publicKey) return null;

    return (
      <>
        <IconButton
          aria-owns={open ? 'menu-account' : undefined}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Identicon publicKey={publicKey} size={32} />
        </IconButton>
        <Menu
          id="menu-account"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem
            className={classes.menu}
            component={Link}
            to='/profile'>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary={
              <Typography color="inherit" noWrap>
                {username || publicKey}
              </Typography>
            } />
          </MenuItem>
          <MenuItem 
            component={Link}
            to='/settings'>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={
              <Typography color="inherit" noWrap>
                Settings
              </Typography>
            } />
          </MenuItem>
        </Menu>
      </>
    );
  }
}

AccountMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object,
  errors: PropTypes.array
};

export default compose(
  connect((state) => {
    const { account, errors } = state || {
      account: {
        publicKey: '',
        username: ''
      },
      errors: []
    };
    return { account, errors };
  }),
  withStyles(styles)
)(AccountMenu);