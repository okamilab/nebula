import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, FormGroup, Label, Input, Alert
} from 'reactstrap';

import { inviteContact } from './../actions';

class ContactInvite extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      publicKey: '',
      error: ''
    };

    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange(e) {
    this.setState({
      publicKey: e.target.value
    });
  }

  onKeyPress(e) {
    if (e.key === 'Enter' && this.state.publicKey) {
      this.invite();
    }
  }

  render() {
    const { error } = this.state;

    return (
      <Fragment>
        <Button color='primary'
          onClick={this.toggle}
          size='sm'
          className='float-right'>
          + Invite contact
        </Button>
        <Modal isOpen={this.state.modal} centered>
          <ModalHeader>Invite contact</ModalHeader>
          <ModalBody>
            {error ? <Alert color='danger'>{error.message || error}</Alert> : null}
            <FormGroup>
              <Label for='contactPublicKey'>Contact public key</Label>
              <Input
                type='text'
                id='contactPublicKey'
                placeholder='Public key'
                onChange={this.onChange}
                onKeyPress={this.onKeyPress}
                autoFocus
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='light' onClick={this.toggle}>Cancel</Button>
            <Button
              type='button'
              color='primary'
              onClick={this.invite}
              disabled={!this.state.publicKey}>Send Request</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }

  invite = async () => {
    try {
      this.setState({ error: null });
      await this.props.dispatch(inviteContact(this.state.publicKey));
    } catch (error) {
      this.setState({ error: error.message });
      return;
    }

    this.toggle();
  };
}

export default compose(connect())(ContactInvite);