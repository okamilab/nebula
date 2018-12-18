import React, { Component, Fragment } from 'react';
import { SwarmClient, hexValueType } from '@erebos/swarm-browser';
import {
  Container, Row, Col, Navbar, NavbarBrand
} from 'reactstrap';

import Account from './components/Account';
import ContactList from './components/ContactList';
import Chat from './components/Chat';
import { get, set } from './storage';
import './App.css';
import logo from './logo.png';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      client: {},
      account: {},
      contacts: []
    };

    this.onContactRequest = this.onContactRequest.bind(this);
  }

  async start() {
    const client = new SwarmClient({ ws: 'ws://127.0.0.1:8546' })
    const [publicKey, overlayAddress] = await Promise.all([
      client.pss.getPublicKey(),
      client.pss.baseAddr(),
    ])
    this.setState({
      client,
      account: {
        publicKey,
        overlayAddress
      }
    }, () => { console.log(this.state) });
  }

  componentDidMount() {
    this.start();
  }

  createRandomString() {
    return Math.random()
      .toString(36)
      .slice(2);
  }

  async onContactRequest(e, value) {
    console.log("Contact public key", value)

    const { client, account } = this.state;
    const key = hexValueType(value);
    const [contactTopic, sharedTopic] = await Promise.all([
      client.pss.stringToTopic(key),
      client.pss.stringToTopic(this.createRandomString()),
    ]);

    await client.pss.setPeerPublicKey(key, contactTopic);
    const message = {
      type: 'contact_request',
      payload: {
        username: undefined,
        message: 'test',
        topic: sharedTopic,
        overlay_address: account.overlayAddress,
      },
      utc_timestamp: Date.now()
    };
    await client.pss.sendAsym(key, contactTopic, message);
    return sharedTopic;
  }

  render() {
    const { account } = this.state;

    return (
      <Fragment>
        <header className="App-header">
          <Navbar expand="md">
            <NavbarBrand href="/">
              <img src={logo} alt="Swarm Messenger"></img>
              <span className="pl-3 text-white">Swarm Messenger</span>
            </NavbarBrand>
          </Navbar>
        </header>
        <Container fluid>
          <Row>
            <Col sm={4}>
              <Account account={account} />
              <ContactList onContactRequest={this.onContactRequest} />
            </Col>
            <Col sm={8}>
              <Chat />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default App;
