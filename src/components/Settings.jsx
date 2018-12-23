import React, { Component } from 'react';
import {
  Container, Row
} from 'reactstrap';

class Settings extends Component {
  render() {
    return (
      <Container fluid>
        <Row className='pt-3'>
          <h3>Settings</h3>
        </Row>
      </Container>
    );
  }
}

export default Settings;