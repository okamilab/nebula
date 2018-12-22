import React, { Component, Fragment } from 'react';
import { hexValueType } from '@erebos/swarm-browser';
import {
  Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem
} from 'reactstrap';
import sum from 'hash-sum';

import Account from './components/Account';
import ContactList from './components/ContactList';
import Chat from './components/Chat';
import ContactsIcon from './components/ContactsIcon';
import ChatsIcon from './components/ChatsIcon';
import storage from './base/storage';
import Messenger from './base/messenger';
import keyUtils from './base/key';
import { groupBy } from './base/fn';

import './App.css';
import logo from './logo.png';

class App extends Component {
  messenger = undefined;

  constructor(props) {
    super(props)

    this.state = {
      account: {},
      contacts: [],
      chats: [],
      selectedChatId: {}
    };

    this.onReceiveContactEvent = this.onReceiveContactEvent.bind(this);
    this.onReceiveChatEvent = this.onReceiveChatEvent.bind(this);
    this.onContactRequest = this.onContactRequest.bind(this);
    this.onAcceptContact = this.onAcceptContact.bind(this);
    this.onDeclineContact = this.onDeclineContact.bind(this);
    this.onStartChat = this.onStartChat.bind(this);
  }

  async init() {
    this.messenger = await new Messenger({ ws: 'ws://127.0.0.1:8546' });
    const { account } = this.messenger;
    const state = storage.get() || {};

    this.setState({
      account,
      ...state[account.publicKey],
    }, () => {
      console.log('STATE', this.state);

      this.messenger.subscribe({
        onReceiveContactEvent: this.onReceiveContactEvent,
        onReceiveChatEvent: this.onReceiveChatEvent,
        chats: this.state.chats
      });
    });
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.messenger.unsubscribe();
  }

  async onContactRequest(value) {
    const { account, contacts } = this.state;
    keyUtils.isValidPubKey(value, account.publicKey, contacts);

    const key = hexValueType(value);
    const { sharedTopic } = await this.messenger.sendContactRequest(key);

    const list = [
      ...contacts,
      {
        key: key,
        topic: sharedTopic,
        type: 'sent_request'
      }
    ];

    this.setState({ contacts: list }, this.saveState);
    return sharedTopic;
  }

  async sendContactResponse(key, accepted) {
    await this.messenger.sendContactResponse(key, accepted);

    const { contacts } = this.state;
    const existing = contacts.find(c => c.key === key);

    const contact = {
      ...existing,
      type: accepted ? 'added' : 'received_declined'
    }

    this.setState(
      { contacts: [...contacts.filter(c => c.key !== key), contact] },
      this.saveState);

  }

  async onAcceptContact(key) {
    await this.sendContactResponse(key, true);
  }

  async onDeclineContact(key) {
    await this.sendContactResponse(key, false);
  }

  onReceiveContactEvent(e) {
    const { contacts } = this.state;
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
      // Response from contact, set type to 'added' or 'sent_declined' accordingly
      const contact = {
        ...existing,
        type: e.payload.contact === true ? 'added' : 'sent_declined',
        username: e.payload.username,
        address: e.payload.overlay_address,
      }

      list = [...contacts.filter(c => c.key !== e.key), contact];
    } else {
      console.error('unhandled event', e);
      return;
    }

    this.setState({ contacts: list }, this.saveState);
  }

  onReceiveChatEvent(e) {
    console.log('onReceiveChatEvent', e);

    const { chats } = this.state;
    const existing = chats.find(c => c.key === e.key);
    if (!existing) {
      throw new Error('Chat is not found');
    }

    const id = sum(e);
    existing.messages = [
      ...existing.messages,
      {
        id,
        sender: e.key,
        isRead: false,
        text: e.payload.text,
        timestamp: e.utc_timestamp,
      }];

    this.setState({
      chats: [...chats.filter(c => c.key !== e.key), existing],
    }, this.saveState);
  }

  onStartChat(contact) {
    console.log('onStartChat', contact);
    const { chats } = this.state;
    const chat = {
      key: contact.key,
      topic: contact.topic,
      messages: []
    };

    const existing = chats.find(c => c.key === contact.key);
    if (existing) {
      this.setState({ selectedChatId: contact.key });
      return;
    }

    const list = [...chats, chat];

    this.setState({
      chats: list,
      selectedChatId: contact.key
    }, this.saveState);
  }

  saveState() {
    const { account, contacts, chats } = this.state;
    const { publicKey } = account || {};
    if (!publicKey) {
      return;
    }

    storage.set({
      [publicKey]: {
        contacts: contacts,
        chats: chats
      }
    });
  }

  render() {
    const { account, contacts, chats, selectedChatId } = this.state;
    const requests = (groupBy(contacts, 'type')['received_request'] || []).length;
    const chat = chats.find(c => c.key === selectedChatId);

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
                  <ContactsIcon active requests={requests} />
                </NavItem>
                <NavItem className='p-2'>
                  <ChatsIcon />
                </NavItem>
              </Nav>
              <ContactList
                list={this.state.contacts}
                onContactRequest={this.onContactRequest}
                onAcceptContact={this.onAcceptContact}
                onDeclineContact={this.onDeclineContact}
                onStartChat={this.onStartChat} />
            </Col>
            <Col lg={9} md={8}>
              <Chat data={chat} />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default App;
