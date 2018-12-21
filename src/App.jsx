import React, { Component, Fragment } from 'react';
import { hexValueType } from '@erebos/swarm-browser';
import {
  Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem
} from 'reactstrap';

import Account from './components/Account';
import ContactList from './components/ContactList';
import Chat from './components/Chat';
import ContactsIcon from './components/ContactsIcon';
import ChatsIcon from './components/ChatsIcon';
import storage from './base/storage';
import Messenger from './base/messenger';
import keyUtils from './base/key';

import './App.css';
import logo from './logo.png';

class App extends Component {
  messenger = undefined;

  constructor(props) {
    super(props)

    this.state = {
      account: {},
      contacts: []
    };

    this.onContactRequest = this.onContactRequest.bind(this);
  }

  async init() {
    this.messenger = await new Messenger({
      ws: 'ws://127.0.0.1:8546',
      onReceiveContactEvent: this.onReceiveContactEvent
    });
    const { account } = this.messenger;
    const state = storage.get() || {};

    this.setState({
      account,
      ...state[account.publicKey],
    }, () => { console.log("STATE", this.state) });
  }

  componentDidMount() {
    this.init();
  }

  async onContactRequest(_, value) {
    const { account, contacts } = this.state;
    keyUtils.isValidPubKey(value, account.publicKey, contacts);

    const key = hexValueType(value);
    const { contactTopic, sharedTopic } =
      await this.messenger.sendContactRequest(key, account.overlayAddress);

    const list = [
      ...contacts,
      {
        key: key,
        topic: contactTopic,
        type: 'sent_request'
      }
    ];

    this.setState({ contacts: list });

    storage.set({
      [account.publicKey]: {
        contacts: list
      }
    });

    return sharedTopic;
  }

  onReceiveContactEvent = (e) => {
    console.log("onReceiveContactEvent", e);

    const { account, contacts } = this.state;
    const existing = contacts.find(c => c.key === e.key);

    let list = [];
    if (
      e.type === 'contact_request' &&
      (existing == null || existing.type === 'received_request')
    ) {
      // New contact or update existing with new payload
      list = [
        ...contacts.filter(c => c.key !== e.key),
        {
          key: e.key,
          type: 'received_request',
          topic: e.payload.topic,
          username: e.payload.username,
          address: e.payload.overlay_address,
        },
      ];
    } else if (
      e.type === 'contact_response' &&
      existing != null &&
      (existing.type === 'sent_declined' ||
        existing.type === 'sent_request')
    ) {
      // Response from contact, set type to "added" or "sent_declined" accordingly
      const contact = {
        ...existing,
        type: e.payload.contact === true ? 'added' : 'sent_declined',
        username: e.payload.username,
        address: e.payload.overlay_address,
      }
      // if (contact.type === 'added') {
      //   createChat = contact
      // }

      list = [...contacts.filter(c => c.key !== e.key), contact];
    } else {
      console.error("unhandled event", e);
      return;
    }

    this.setState({ contacts: list });

    storage.set({
      [account.publicKey]: {
        contacts: list
      }
    });
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
              <ContactList
                list={this.state.contacts}
                onContactRequest={this.onContactRequest} />
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
