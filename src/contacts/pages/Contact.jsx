import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  Container, Row, Col, FormGroup, Label, Input, Button
} from 'reactstrap';

import Identicon from './../../base/components/Identicon';

class Contact extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contact: PropTypes.object,
  };

  render() {
    const { contact } = this.props;
    if (!contact) {
      return <div>Contact not found</div>
    }

    const { username, key, address } = contact;
    return (
      <Container fluid>
        <Row className='section-header pt-3'>
          <h4>Contact</h4>
        </Row>
        <Row>
          <Col
            lg={{ size: 8, offset: 2 }}
            md={{ size: 10, offset: 1 }}>
            <Row className='pt-3'>
              <Col sm={3}>Identicon</Col>
              <Col sm={9}>
                {
                  key ?
                    <Identicon publicKey={key} size={78} /> :
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
                <Label>Public key</Label>
              </Col>
              <Col sm={9} className='text-break'>
                {key}
              </Col>
            </FormGroup>
            <FormGroup className='row pt-3'>
              <Col sm={3}>
                <Label>Address</Label>
              </Col>
              <Col sm={9} className='text-break'>
                {address}
              </Col>
            </FormGroup>
            <div className='pt-3'>
              {/* <Button
                color='success'
                onClick={this.save}>Save</Button> */}
              <Button
                color='success'
                tag={Link} to={'/chat/' + key}>Chat</Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default compose(
  connect((state, props) => {
    const { contacts } = state || {};
    return { contact: contacts[props.match.params.key] };
  })
)(withRouter(Contact));