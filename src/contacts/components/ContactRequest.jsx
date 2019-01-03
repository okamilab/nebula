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
    value: PropTypes.string.isRequired,
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
    const { value } = this.props;

    return (
      <div className='text-truncate' onClick={this.toggle}>
        {value}
        <Modal isOpen={this.state.modal} centered>
          <ModalHeader>Received contact</ModalHeader>
          <ModalBody style={{ wordWrap: 'break-word' }}>
            Do you want to accept request from {value}?
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
    const { value, dispatch } = this.props;
    dispatch(acceptContact(value));
    this.toggle();
  };

  decline = () => {
    const { value, dispatch } = this.props;
    dispatch(declineContact(value));
    this.toggle();
  };
}

export default compose(connect())(ContactRequest);