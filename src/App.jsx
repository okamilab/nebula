import React, { Component, Fragment } from 'react';
import { SwarmClient, hexValueType } from '@erebos/swarm-browser';
import {
  Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem
} from 'reactstrap';

import Account from './components/Account';
import ContactList from './components/ContactList';
import Chat from './components/Chat';
import storage from './storage';
import './App.css';
import logo from './logo.png';

import ContactsIcon from './components/ContactsIcon';
import ChatsIcon from './components/ChatsIcon';

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
    const client = new SwarmClient({ ws: 'ws://127.0.0.1:8546' });
    const [publicKey, overlayAddress] = await Promise.all([
      client.pss.getPublicKey(),
      client.pss.baseAddr(),
    ]);

    const state = storage.get() || {};

    this.setState({
      client,
      account: {
        publicKey,
        overlayAddress
      },
      ...state[publicKey],
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

  async onContactRequest(_, value) {
    const { client, account, contacts } = this.state;

    const key = hexValueType(value);
    const exists = contacts.find(c => c.key === key);
    if (exists) {
      return { error: 'The contact already present in your list of contacts' };
    }

    const [contactTopic, sharedTopic] = await Promise.all([
      client.pss.stringToTopic(key),
      client.pss.stringToTopic(this.createRandomString()),
    ]);

    await client.pss.setPeerPublicKey(key, contactTopic);
    const message = {
      type: 'contact_request',
      payload: {
        username: undefined,
        message: 'Hi there',
        topic: sharedTopic,
        overlay_address: account.overlayAddress,
      },
      utc_timestamp: Date.now()
    };
    await client.pss.sendAsym(key, contactTopic, message);

    const list = [
      ...this.state.contacts,
      {
        key: key,
        topic: contactTopic,
        status: 'sent_request'
      }
    ];

    this.setState({ contacts: list });

    storage.set({
      [account.publicKey]: {
        contacts: list
      }
    })

    return sharedTopic;
  }

  render() {
    const { account } = this.state;

    return (
      <Fragment>
        <header className='App-header'>
          <Navbar expand='md'>
            <NavbarBrand href='/'>
              <img src={logo} alt='Swarm Messenger'></img>
              <span className='pl-3 text-white'>Swarm Messenger</span>
            </NavbarBrand>
          </Navbar>
        </header>
        <Container fluid>
          <Row>
            <Col lg={3} md={4}>
              <Account account={account} />
              <Nav style={{
                borderBottomColor: '#282c34',
                borderBottomWidth: 3,
                borderBottomStyle: 'solid'
              }} className='pt-4' fill>
                <NavItem className='p-2' style={{ background: '#282c34' }}>
                  <ContactsIcon active></ContactsIcon>
                </NavItem>
                <NavItem className='p-2'>
                  <ChatsIcon></ChatsIcon>
                </NavItem>
              </Nav>
              <ContactList list={this.state.contacts} onContactRequest={this.onContactRequest} />
            </Col>
            <Col lg={9} md={8}>
              <Chat />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default App;
