import React, { Component } from 'react';
import {
  Container, Row, Col, FormGroup, Label, Input, Button
} from 'reactstrap';
import pretty from 'prettysize';

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {};
    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    const { endpoint, username } =
      Object.assign({}, this.props, this.state);
    this.props.onSave(endpoint, username);
  }

  render() {
    const {
      endpoint,
      username,
      localStorage,
    } = this.props;

    return (
      <Container fluid>
        <Row className='pt-3'>
          <h3>Settings</h3>
        </Row>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='endpoint'>Swarm endpoint</Label>
          </Col>
          <Col sm={9}>
            <Input
              type='text'
              id='endpoint'
              placeholder='endpoint'
              onChange={(e) => this.setState({ endpoint: e.target.value })}
              autoFocus
              defaultValue={endpoint}
            />
          </Col>
          <Col sm={12}>
            After updating the field you need to restart the app (refresh page)
          </Col>
        </FormGroup>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='username'>User name</Label>
          </Col>
          <Col sm={9}>
            <Input
              type='text'
              id='username'
              placeholder='username'
              onChange={(e) => this.setState({ username: e.target.value })}
              defaultValue={username} />
          </Col>
        </FormGroup>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='localStorage'>Local storage</Label>
          </Col>
          <Col sm={9}>
            {pretty((localStorage || '').length)}
          </Col>
        </FormGroup>
        <div className="pt-3">
          <Button
            color="success"
            onClick={this.onSave}>
            Save
          </Button>
        </div>
      </Container>
    );
  }
}

export default Settings;