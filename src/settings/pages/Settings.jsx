import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Container, Row, Col, FormGroup, Label, Input, Button
} from 'reactstrap';
import pretty from 'prettysize';

class Settings extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    pss: PropTypes.string,
    bzz: PropTypes.string,
    raw: PropTypes.string
  };

  render() {
    const { pss, bzz, raw } = this.props;

    return (
      <Container fluid>
        <Row className='pt-3'>
          <h3>Settings</h3>
        </Row>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='pss'>PSS endpoint (WebSocket)</Label>
          </Col>
          <Col sm={9}>
            <Input
              type='text'
              id='pss'
              autoFocus
              onChange={(e) => this.setState({ pss: e.target.value })}
              defaultValue={pss} />
          </Col>
          <Col sm={12}
            className='pt-1 text-secondary'
            style={{ fontSize: 13 }}>
            After updating the field you need to restart the app (refresh page)
        </Col>
        </FormGroup>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='bzz'>BZZ endpoint</Label>
          </Col>
          <Col sm={9}>
            <Input
              type='text'
              id='bzz'
              onChange={(e) => this.setState({ bzz: e.target.value })}
              defaultValue={bzz} />
          </Col>
          <Col sm={12}
            className='pt-1 text-secondary'
            style={{ fontSize: 13 }}>
            After updating the field you need to restart the app (refresh page)
        </Col>
        </FormGroup>
        <FormGroup className='row pt-3'>
          <Col sm={3}>
            <Label for='localStorage'>Local storage</Label>
          </Col>
          <Col sm={9}>
            {pretty((raw || '').length)}
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
    )
  }
}

export default compose(
  connect((state) => {
    const { appState } = state || {
      appState: {
        pss: '',
        bzz: '',
        raw: ''
      }
    };
    return {
      pss: appState.pss,
      bzz: appState.bzz,
      raw: appState.raw
    };
  })
)(Settings);