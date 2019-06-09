import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  fixed: {
    position: "fixed",
    top: 0,
    left: '50%',
    right: 'auto',
    zIndex: 1400,
    transform: 'translateX(-50%)'
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  }
});

class ConnectionController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.app.isConnected && nextProps.app.isConnected && !this.state.isOpen) {
      this.setState({ isOpen: true });
      setTimeout(() => { this.setState({ isOpen: false }) }, 3000);
    }
  }

  render() {
    const { classes, app, children, location } = this.props;
    const { pathname } = location;

    if (app.isStarted && !app.isConnected && pathname !== '/settings') {
      return <Redirect to={'/settings'} />;
    }

    return (
      <>
        <div className={classes.fixed}>
          {this.state.isOpen && <SnackbarContent className={classes.success} message="Connected" />}
          {!app.isConnected && <SnackbarContent className={classes.error} message="No connection" />}
        </div>
        {children}
      </>
    );
  }
}

ConnectionController.propTypes = {
  classes: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default compose(
  connect((state) => {
    const { app } = state || {
      isConnected: false,
      isStarted: false
    };
    return { app };
  }),
  withStyles(styles)
)(withRouter(ConnectionController));