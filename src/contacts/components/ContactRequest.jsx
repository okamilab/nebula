import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Button, Modal, ModalHeader,
  ModalBody, ModalFooter
} from 'reactstrap';

import { acceptContact, declineContact } from './../actions';

class ContactRequest extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    publicKey: PropTypes.string.isRequired,
    address: PropTypes.string
  };

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
      <div className='text-truncate' onClick={this.toggle}>
        <div>{publicKey}</div>
        <Modal isOpen={this.state.modal} centered autoFocus={false}>
          <ModalHeader>Received contact</ModalHeader>
          <ModalBody className='text-break'>
            Do you want to accept request from {publicKey}?
          </ModalBody>
          <ModalFooter>
            <Button color='light' onClick={this.decline}>Decline</Button>
            <Button color='primary' onClick={this.accept}>Accept</Button>
          </ModalFooter>
        </Modal>
      </div>
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

export default compose(connect())(ContactRequest);