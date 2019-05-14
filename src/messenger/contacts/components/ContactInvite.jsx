import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import { Add } from '@material-ui/icons';

import { inviteContact } from './../actions';

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
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

  toggle() {
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
              id="contactAddress"
              label="Contact public key *"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ publicKey: e.target.value })}
              onKeyPress={this.onKeyPress}
            />
            <TextField
              margin="dense"
              id="contactPublicKey"
              label="Contact address"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ address: e.target.value })}
              onKeyPress={this.onKeyPress}
            />
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