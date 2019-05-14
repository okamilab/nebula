import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
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

class WsConnection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.app.connected && nextProps.app.connected && !this.state.isOpen) {
      this.setState({ isOpen: true });
      setTimeout(() => { this.setState({ isOpen: false }) }, 3000);
    }
  }

  render() {
    const { classes, app } = this.props;

    return (
      <div className={classes.fixed}>
        {
          this.state.isOpen ?
            <SnackbarContent className={classes.success} message="Connected" /> :
            null
        }
        {
          app.connected ?
            null :
            <SnackbarContent className={classes.error} message="No connection" />
        }
      </div>
    );
  }
}

WsConnection.propTypes = {
  classes: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default compose(
  connect((state) => {
    const { app } = state || {
      connected: false
    };
    return { app };
  }),
  withStyles(styles)
)(WsConnection);