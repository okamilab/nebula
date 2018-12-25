import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, FormGroup, Label, Input, Button
} from 'reactstrap';
import pretty from 'prettysize';

class Settings extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    endpoint: PropTypes.string,
  };

  constructor(props) {
    super(props)

    this.state = {};

    this.onSave = this.onSave.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  onSave() {
    const { endpoint } =
      Object.assign({}, this.props, this.state);
    this.props.onSave(endpoint);
  }

  async onReset() {
    await this.props.onReset();
    const { endpoint } = this.props;
    this.setState({ endpoint });
  }

  render() {
    const {
      endpoint,
      localStorage
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
              autoFocus
              onChange={(e) => this.setState({ endpoint: e.target.value })}
              defaultValue={endpoint} />
          </Col>
          <Col sm={12}
            className='pt-1 text-secondary'
            style={{fontSize: 13}}>
            After updating the field you need to restart the app (refresh page)
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
        <div className='pt-3'>
          <Button
            color='second'
            onClick={this.onReset}>
            Reset
          </Button>
          <Button
            color='success'
            onClick={this.onSave}
            className='ml-3'>
            Save
          </Button>
        </div>
      </Container>
    );
  }
}

export default Settings;