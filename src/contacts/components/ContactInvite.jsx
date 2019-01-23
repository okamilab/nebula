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
    const { error } = this.state;

    return (
      <Fragment>
        <Button color='primary'
          onClick={this.toggle}
          size='sm'
          className='float-right'>
          + Invite contact
        </Button>
        <Modal isOpen={this.state.modal} centered autoFocus={false}>
          <ModalHeader>Invite contact</ModalHeader>
          <ModalBody>
            {error ? <Alert color='danger'>{error.message || error}</Alert> : null}
            <FormGroup>
              <Label for='contactPublicKey'>Contact public key *</Label>
              <Input
                type='text'
                id='contactPublicKey'
                placeholder='Public key'
                onChange={(e) => this.setState({ publicKey: e.target.value })}
                onKeyPress={this.onKeyPress}
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <Label for='contactAddress'>Contact address</Label>
              <Input
                type='text'
                id='contactAddress'
                placeholder='Address'
                onChange={(e) => this.setState({ address: e.target.value })}
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

export default compose(connect())(ContactInvite);