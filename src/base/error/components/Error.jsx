import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { dismissError } from './../actions';

const styles = theme => ({
  fixed: {
    position: "fixed",
    top: 0,
    left: '50%',
    right: 'auto',
    zIndex: 1400,
    transform: 'translateX(-50%)'
  },
  error: {
    backgroundColor: theme.palette.error.dark
  }
});

class Error extends Component {
  render() {
    const { classes, errors } = this.props;

    return (
      <div className={classes.fixed}>
        {
          errors.map((error, i) =>
            <SnackbarContent
              key={i}
              className={classes.error}
              message={error}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => this.dismiss(error)}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              ]} />
          )
        }
      </div>
    );
  }

  dismiss(error) {
    this.props.dispatch(dismissError(error));
  }
}

Error.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errors: PropTypes.array,
};

export default compose(
  connect((state) => {
    const { errors } = state || [];
    return { errors };
  }),
  withStyles(styles)
)(Error);