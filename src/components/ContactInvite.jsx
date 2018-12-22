import React, { Component, Fragment } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Alert
} from 'reactstrap';

class ContactInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      publicKey: '',
      error: ''
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
        <Button color="primary" onClick={this.toggle} size="sm" className="float-right">+ Invite contact</Button>
        <Modal isOpen={this.state.modal} centered>
          <Form className="pt-3">
            <ModalHeader>Invite contact</ModalHeader>
            <ModalBody>
              {this.state.error ? <Alert color="danger">{this.state.error}</Alert> : null}
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
                onClick={async (e) => {
                  try {
                    await this.props.onRequest(this.state.publicKey);
                  } catch (error) {
                    if (error) {
                      this.setState({ error: error.message });
                      return;
                    }
                  }

                  this.toggle();
                }}>Send Request</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default ContactInvite;