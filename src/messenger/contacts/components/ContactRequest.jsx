import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { acceptContact, declineContact } from './../actions';

class ContactRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { publicKey } = this.props;

    return (
      <ListItem button onClick={this.toggle}>
        <ListItemText
          disableTypography
          primary={
            <Typography color='inherit' noWrap>
              {publicKey}
            </Typography>
          } />
        <Dialog
          open={this.state.modal}
          onClose={this.toggle}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Received contact</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography noWrap>
                Do you want to accept request from {publicKey}?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.decline} color="default">
              Decline
            </Button>
            <Button
              onClick={this.accept}
              variant="contained"
              color="primary">
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </ListItem>
    );
  }

  accept = () => {
    const { publicKey, address, dispatch } = this.props;
    dispatch(acceptContact(publicKey, address));
    this.toggle();
  };

  decline = () => {
    const { publicKey, address, dispatch } = this.props;
    dispatch(declineContact(publicKey, address));
    this.toggle();
  };
}

ContactRequest.propTypes = {
  dispatch: PropTypes.func.isRequired,
  publicKey: PropTypes.string.isRequired,
  address: PropTypes.string
};

export default compose(connect())(ContactRequest);