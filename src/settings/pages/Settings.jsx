import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Container, Row, Col, FormGroup, Label, Input, Button, Card
} from 'reactstrap';
import pretty from 'prettysize';

import { DEFAULT_SETTINGS } from '../../base/default'
import { updateSettings, resetSettings } from './../../settings/actions';

class Settings extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    pss: PropTypes.string,
    bzz: PropTypes.string,
    revealAddress: PropTypes.number,
    size: PropTypes.number
  };

  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    const { pss, bzz, revealAddress, size } = this.props;

    return (
      <Container fluid>
        <Row className='section-header pt-3'>
          <h4>Settings</h4>
        </Row>
        <Row>
          <Col
            lg={{ size: 8, offset: 2 }}
            md={{ size: 10, offset: 1 }}>
            <h6 className='pt-3 pb-1'>General</h6>
            <Card className='section'>
              <FormGroup className='row pt-3'>
                <Col sm={4}>
                  <Label for='pss'>PSS endpoint (WebSocket)</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type='text'
                    id='pss'
                    autoFocus
                    onChange={(e) => this.setState({ pss: e.target.value })}
                    defaultValue={pss} />
                </Col>
                <Col sm={12} className='pt-1 text-sub'>
                  After updating the field you need to restart the app (refresh page)
                </Col>
              </FormGroup>
              <FormGroup className='row pt-3'>
                <Col sm={4}>
                  <Label for='bzz'>BZZ endpoint</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type='text'
                    id='bzz'
                    onChange={(e) => this.setState({ bzz: e.target.value })}
                    defaultValue={bzz} />
                </Col>
                <Col sm={12} className='pt-1 text-sub'>
                  After updating the field you need to restart the app (refresh page)
                </Col>
              </FormGroup>
              <FormGroup className='row pt-3'>
                <Col sm={4}>
                  <Label>Local storage</Label>
                </Col>
                <Col sm={8}>
                  {pretty(size)}
                </Col>
              </FormGroup>
            </Card>
            <h6 className='pt-3 pb-1'>Security</h6>
            <Card className='section'>
              <FormGroup className='row pt-3'>
                <Col sm={4}>
                  <Label for='revealAddress'>Reveal address partially</Label>
                </Col>
                <Col sm={8}>
                  <Input
                    type='select'
                    name='revealAddress'
                    id='revealAddress'
                    onChange={(e) => this.setState({ revealAddress: +e.target.value })}
                    defaultValue={revealAddress}>
                    <option value={0}>Broadcast</option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>Full</option>
                  </Input>
                </Col>
              </FormGroup>
            </Card>
            <div className='pt-3'>
              <Button
                color='second'
                onClick={this.reset}>Reset</Button>
              <Button
                color='success'
                onClick={this.save}
                className='ml-3'>Save</Button>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  reset = () => {
    this.props.dispatch(resetSettings());
  };

  save = () => {
    const { pss, bzz, revealAddress } =
      Object.assign({}, this.props, this.state);
    this.props.dispatch(updateSettings({ pss, bzz, revealAddress }));
  };
}

export default compose(
  connect((state) => {
    const { settings } = state || {
      settings: {
        pss: DEFAULT_SETTINGS.pss,
        bzz: DEFAULT_SETTINGS.bzz,
        revealAddress: DEFAULT_SETTINGS.revealAddress,
        size: 0
      }
    };
    return settings;
  })
)(Settings);