import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, FormGroup, Label, Input, Button
} from 'reactstrap';

import Identicon from '../common/Identicon';

class Contact extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    publicKey: PropTypes.string,
    username: PropTypes.string,
  };

  constructor(props) {
    super(props)

    this.state = {};

    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    const { username } =
      Object.assign({}, this.props, this.state);
    this.props.onSave(username);
  }

  render() {
    const { username, publicKey } = this.props;

    return (
      <Container>
        <Row className='pt-3'>
          <h3>Contact</h3>
        </Row>
        <Row className='pt-3'>
          <Col sm={3}>
            Identicon
          </Col>
          <Col sm={9}>
            {
              publicKey ?
                <Identicon publicKey={publicKey} size={78} /> :
                null
            }
          </Col>
        </Row>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='username'>User name</Label>
          </Col>
          <Col sm={9}>
            <Input
              type='text'
              id='username'
              placeholder='username'
              disabled
              onChange={(e) => this.setState({ username: e.target.value })}
              defaultValue={username} />
          </Col>
        </FormGroup>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='publicKey'>Public key</Label>
          </Col>
          <Col sm={9}>
            <div style={{ wordWrap: 'break-word' }}>
              {publicKey}
            </div>
          </Col>
        </FormGroup>
        {/* <div className='pt-3'>
          <Button
            color='success'
            onClick={this.onSave}>
            Save
          </Button>
        </div> */}
      </Container>
    );
  }
}

export default Contact;