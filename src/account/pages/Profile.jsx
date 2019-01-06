import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Container, Row, Col, FormGroup, Label, Input, Button
} from 'reactstrap';

import Identicon from './../../base/components/Identicon';
import { updateUsername } from './../actions';

class Profile extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    account: PropTypes.object,
  };

  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    const { account } = this.props;
    if (!account) {
      return <div>Loading</div>
    }

    const { username, publicKey } = account;
    return (
      <Container fluid>
        <Row className='section-header pt-3'>
          <h4>Profile</h4>
        </Row>
        <Row>
          <Col
            lg={{ size: 8, offset: 2 }}
            md={{ size: 10, offset: 1 }}>
            <Row className='pt-3'>
              <Col sm={3}>Identicon</Col>
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
                  onChange={(e) => this.setState({ username: e.target.value })}
                  defaultValue={username} />
              </Col>
            </FormGroup>
            <FormGroup className='row pt-3'>
              <Col sm={3}>
                <Label for='publicKey'>Public key</Label>
              </Col>
              <Col sm={9}>
                <div className='text-break'>
                  {publicKey}
                </div>
              </Col>
            </FormGroup>
            <div className='pt-3'>
              <Button
                color='success'
                onClick={this.save}>Save</Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  save = async () => {
    const { username } =
      Object.assign({}, this.props, this.state);
    await this.props.dispatch(updateUsername(username));
  };
}

export default compose(
  connect((state) => {
    const { account } = state || {
      account: {
        publicKey: '',
        username: ''
      }
    };
    return { account };
  })
)(Profile);