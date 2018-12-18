import React, { Component, Fragment } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap';

class ContactInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      publicKey: ''
    };

    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
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

  render() {
    return (
      <Fragment>
        <Button color="primary" onClick={this.toggle} block>Invite contact</Button>
        <Modal isOpen={this.state.modal} centered>
          <Form className="pt-3">
            <ModalHeader>Invite contact</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="contactPublicKey">Contact public key</Label>
                <Input
                  type="text"
                  id="contactPublicKey"
                  placeholder="Public key"
                  onChange={this.onChange}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={this.toggle}>Cancel</Button>
              <Button color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.onRequest(e, this.state.publicKey);
                  //TODO: close modal when everything is ok, if not, show error message
                }}>Send Request</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default ContactInvite;