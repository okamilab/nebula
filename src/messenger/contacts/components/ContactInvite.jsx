import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import { Add, ExpandMore } from '@material-ui/icons';

import { inviteContact } from './../actions';

const ExpansionPanel = withStyles({
  root: {
    border: 'none',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    padding: 0,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    margin: '10px 0 20px',
    position: 'relative',
    '&::after': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '0.5em',
      borderTop: '1px solid #ddd'
    },
    '&$expanded': {
      margin: '12px 0',
    }
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: 0,
  },
}))(MuiExpansionPanelDetails);

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  title: {
    padding: '0 10px',
    color: '#bbb',
    fontSize: '14px',
    background: '#fff',
    zIndex: 10
  }
});

class ContactInvite extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      publicKey: '',
      address: '',
      error: ''
    };

    this.toggle = this.toggle.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  toggle(e) {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }

    this.setState({
      error: null,
      modal: !this.state.modal
    });
  }

  onKeyPress(e) {
    if (e.key === 'Enter' && this.state.publicKey) {
      this.invite();
    }
  }

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <>
        <IconButton color="inherit" onClick={this.toggle}>
          <Add />
        </IconButton>
        <Dialog
          open={this.state.modal}
          onClose={this.toggle}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle id="form-dialog-title">Invite contact</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {error ?
                <SnackbarContent
                  message={error.message || error}
                  className={classes.error}></SnackbarContent>
                : null}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Public key or Address or ENS *"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ publicKey: e.target.value })}
              onKeyPress={this.onKeyPress}
            />
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <span className={classes.title}>
                  Advanced
                </span>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TextField
                  margin="dense"
                  label="Overlay address"
                  type="text"
                  fullWidth
                  onChange={(e) => this.setState({ address: e.target.value })}
                  onKeyPress={this.onKeyPress}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggle} color="default">
              Cancel
            </Button>
            <Button
              onClick={this.invite}
              disabled={!this.state.publicKey}
              variant="contained"
              color="primary">
              Send request
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  invite = async () => {
    try {
      const { publicKey, address } = this.state
      this.setState({ error: null });
      await this.props.dispatch(inviteContact(publicKey, address));
    } catch (error) {
      this.setState({ error: error.message });
      return;
    }

    this.toggle();
  };
}

ContactInvite.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  connect(),
  withStyles(styles)
)(ContactInvite);