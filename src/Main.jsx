import React, { Component } from 'react';
import { hexValueType } from '@erebos/swarm-browser';
import {
  Row, Col, Nav, NavItem
} from 'reactstrap';
import sum from 'hash-sum';
import FileSaver from 'file-saver';

import Account from './components/account/Account';
import Settings from './components/account/Settings';
import Profile from './components/account/Profile';
import ContactList from './components/contact/ContactList';
import ContactsIcon from './components/contact/ContactsIcon';
import Contact from './components/contact/Contact';
import ChatList from './components/chat/ChatList';
import Chat from './components/chat/Chat';
import ChatsIcon from './components/chat/ChatsIcon';
import storage from './base/storage';
import Messenger from './base/messenger';
import keyUtils from './base/key';

import { readFile } from './base/fn';

const DEFAULT_SETTINGS = {
  pss: 'ws://127.0.0.1:8546',
  bzz: 'http://127.0.0.1:8500'
}

class App extends Component {
  messenger = undefined;

  constructor(props) {
    super(props)

    this.state = {
      account: {},
      contacts: {},
      chats: [],
      selectedChatId: undefined,
      selectedChat: false,
      showSettings: false,
      showProfile: false,
      selectedContactKey: undefined,
      showContact: false,
    };

    this.onReceiveContactEvent = this.onReceiveContactEvent.bind(this);
    this.onReceiveChatEvent = this.onReceiveChatEvent.bind(this);
    this.onContactRequest = this.onContactRequest.bind(this);
    this.onAcceptContact = this.onAcceptContact.bind(this);
    this.onDeclineContact = this.onDeclineContact.bind(this);
    this.onStartChat = this.onStartChat.bind(this);
    this.onMessageSend = this.onMessageSend.bind(this);
    this.onSettingsSave = this.onSettingsSave.bind(this);
    this.onSettingsResest = this.onSettingsResest.bind(this);
    this.onProfileSave = this.onProfileSave.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onFileDownload = this.onFileDownload.bind(this);
    this.onOpenContactInfo = this.onOpenContactInfo.bind(this);
  }

  async init() {
    const appState = storage.get() || {};
    const { pss, bzz } = { ...DEFAULT_SETTINGS, ...appState };

    this.messenger = await new Messenger({ ws: pss, bzz });
    const { account } = this.messenger;
    const sessionState = appState[account.publicKey];

    this.setState({
      pss,
      bzz,
      account,
      ...sessionState,
    }, () => {
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
    const { account, username, contacts } = this.state;
    const key = hexValueType(value);
    keyUtils.isValidPubKey(key, account.publicKey, contacts[sum(key)]);

    const { sharedTopic } =
      await this.messenger.sendContactRequest(key, username);

    const contact = {
      key: key,
      topic: sharedTopic,
      type: 'sent_request'
    };

    this.setState({
      contacts: { ...contacts, [sum(key)]: contact }
    }, this.saveState);
    return sharedTopic;
  }

  async sendContactResponse(key, accepted) {
    const { account, username, contacts, chats } = this.state;
    await this.messenger.sendContactResponse(key, accepted, { username });

    const hash = sum(key);
    const contact = {
      ...contacts[hash],
      type: accepted ? 'added' : 'received_declined'
    };

    if (accepted) {
      await this.messenger.subscribeChat(contact, this.onReceiveChatEvent);
    }

    this.setState(
      {
        contacts: { ...contacts, [hash]: contact },
        chats: accepted ? [...chats, {
          key: contact.key,
          topic: contact.topic,
          participants: {
            [sum(contact.key)]: contact.key,
            [sum(account.publicKey)]: account.publicKey,
          },
          messages: {}
        }] : chats,
      },
      this.saveState);
  }

  async onAcceptContact(key) {
    await this.sendContactResponse(key, true);
  }

  async onDeclineContact(key) {
    await this.sendContactResponse(key, false);
  }

  async onReceiveContactEvent(e) {
    const { account, contacts, chats } = this.state;
    const hash = sum(e.key);
    const existing = contacts[hash];

    if (
      e.type === 'contact_request' &&
      (existing == null || existing.type === 'received_request')
    ) {
      // New contact or update existing with new payload
      this.setState({
        contacts: {
          ...contacts, [hash]: {
            key: e.key,
            type: 'received_request',
            topic: e.payload.topic,
            username: e.payload.username,
            address: e.payload.overlay_address,
          }
        }
      }, this.saveState);
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

      if (e.payload.contact) {
        await this.messenger.subscribeChat(contact, this.onReceiveChatEvent);
      }

      this.setState({
        contacts: { ...contacts, [hash]: contact },
        chats: e.payload.contact ? [...chats, {
          key: contact.key,
          topic: contact.topic,
          participants: {
            [sum(contact.key)]: contact.key,
            [sum(account.publicKey)]: account.publicKey,
          },
          messages: {}
        }] : chats,
      }, this.saveState);
    } else {
      console.error('unhandled event', e);
      return;
    }
  }

  onReceiveChatEvent(e) {
    const { chats } = this.state;
    const chat = chats.find(c => c.key === e.key);
    if (!chat) {
      throw new Error('Chat is not found');
    }

    chat.messages[sum(e)] = {
      sender: sum(e.key),
      isRead: false,
      text: e.payload.text,
      timestamp: e.utc_timestamp,
    };

    this.setState({
      chats: [...chats.filter(c => c.key !== e.key), chat],
    }, this.saveState);
  }

  onStartChat(contact) {
    const { account, chats } = this.state;

    const existing = chats.find(c => c.key === contact.key);
    if (existing) {
      this.setState({
        selectedChatId: contact.key,
        selectedChat: true,
        showSettings: false,
        showProfile: false,
        showContact: false,
      });
      return;
    }

    const chat = {
      key: contact.key,
      topic: contact.topic,
      participants: {
        [sum(contact.key)]: contact.key,
        [sum(account.publicKey)]: account.publicKey,
      },
      messages: {}
    };

    this.setState({
      chats: [...chats, chat],
      selectedChatId: contact.key,
      selectedChat: true,
      showSettings: false,
      showContact: false
    }, this.saveState);
  }

  async onMessageSend(key, message) {
    const { account, chats } = this.state;
    const chat = chats.find(c => c.key === key);
    if (!chat) {
      throw new Error('Chat is not found');
    }

    await this.messenger.sendChatMessage(chat.key, chat.topic, { text: message });

    const msg = {
      sender: sum(account.publicKey),
      isRead: true,
      text: message,
      timestamp: Date.now()
    }
    chat.messages[sum(msg)] = msg;

    this.setState({
      chats: [...chats.filter(c => c.key !== key), chat],
    }, this.saveState);
  }

  onSettingsSave(pss, bzz) {
    this.setState({ pss, bzz }, this.saveState);
  }

  onSettingsResest() {
    this.setState({
      pss: DEFAULT_SETTINGS.pss,
      bzz: DEFAULT_SETTINGS.bzz
    }, this.saveState);
  }

  onProfileSave(username) {
    this.setState({ username }, this.saveState);
  }

  async onFileUpload(e, key) {
    if (!e.target.files.length) {
      return;
    }

    const { bzz } = this.messenger.client;
    const file = e.target.files[0];

    const readEvent = await readFile(e.target.files[0]);
    const buffer = readEvent.currentTarget.result
    const hash = await bzz.uploadFile(buffer, { contentType: file.type });
    this.onMessageSend(key, 'bzz:/' + hash);
  }

  async onFileDownload(hash) {
    const { bzz } = this.messenger.client;
    const file = await bzz.download(hash);
    await FileSaver.saveAs(await file.blob());
  }

  saveState() {
    const {
      pss,
      bzz,
      username,
      account,
      contacts,
      chats } = this.state;
    const { publicKey } = account || {};
    if (!publicKey) {
      storage.set({ pss, bzz });
      return;
    }

    storage.set({
      pss,
      bzz,
      [publicKey]: {
        username,
        contacts: contacts,
        chats: chats
      }
    });
  }

  onOpenContactInfo(key) {
    this.setState({
      selectedContactKey: key,
      selectedChat: false,
      showSettings: false,
      showContact: true
    });
  }

  getChatParticipants(chat) {
    if (!chat) {
      return [];
    }

    const { account, contacts } = this.state;
    const { publicKey } = account;

    const participants = {
      [sum(publicKey)]: { key: publicKey }
    };

    Object.keys(chat.participants)
      .forEach(k => {
        const contact = contacts[k];
        if (!contact) {
          return;
        }
        participants[k] = contacts[k];
      });

    return participants;
  }

  render() {
    const {
      pss,
      bzz,
      account,
      username,
      contacts,
      chats,
      selectedChat,
      selectedChatId,
      showSettings,
      showProfile,
      selectedContactKey,
      showContact
    } = this.state;

    const requests = Object.values(contacts)
      .filter(c => c.type === 'received_request')
      .length;
    const chat = chats.find(c => c.key === selectedChatId);
    const activeContactsStyle = !selectedChat ? { background: '#282c34' } : {};
    const activeChatsStyle = selectedChat ? { background: '#282c34' } : {};
    const selectedContact = selectedContactKey ? contacts[sum(selectedContactKey)] : undefined;

    return (
      <Row className='flex-grow-1'>
        <Col xl={3} lg={3} md={4} style={{ borderRight: '1px solid #eee' }}>
          <Account
            account={account}
            username={username}
            onSettingsClick={() => this.setState({ showSettings: true })}
            onProfileClick={() => this.setState({
              showSettings: false,
              showProfile: true
            })} />
          <Nav style={{ borderBottom: '3px solid #282c34' }} className='pt-4' fill>
            <NavItem
              className='p-2'
              style={{ ...activeContactsStyle, cursor: 'pointer' }}
              onClick={() => {
                this.setState({
                  selectedChatId: undefined,
                  selectedChat: false,
                  showSettings: false,
                  showProfile: false,
                  showContact: false
                })
              }}>
              <ContactsIcon active={!selectedChat} requests={requests} />
            </NavItem>
            <NavItem
              className='p-2'
              style={{ ...activeChatsStyle, cursor: 'pointer' }}
              onClick={() => {
                this.setState({
                  selectedChat: true,
                  showSettings: false,
                  showProfile: false,
                  showContact: false
                })
              }}>
              <ChatsIcon active={selectedChat} />
            </NavItem>
          </Nav>
          {
            selectedChat ?
              <ChatList
                list={chats}
                onStartChat={this.onStartChat} /> :
              <ContactList
                list={Object.values(contacts)}
                onContactRequest={this.onContactRequest}
                onAcceptContact={this.onAcceptContact}
                onDeclineContact={this.onDeclineContact}
                onStartChat={this.onStartChat}
                onOpenInfo={this.onOpenContactInfo} />
          }
        </Col>
        <Col
          xl={{ size: 5, offset: 2 }}
          lg={{ size: 7, offset: 1 }}
          md={{ size: 8, offset: 0 }}>
          {
            showSettings ?
              <Settings
                pss={pss}
                bzz={bzz}
                localStorage={storage.getRaw()}
                onSave={this.onSettingsSave}
                onReset={this.onSettingsResest} /> :
              showProfile && account ?
                <Profile
                  username={username}
                  publicKey={account.publicKey || ''}
                  onSave={this.onProfileSave} /> :
                showContact && selectedContact ?
                  <Contact
                    username={selectedContact.username}
                    publicKey={selectedContact.key}
                    onSave={() => console.log} /> :
                  chat ?
                    <Chat
                      id={chat.key}
                      messages={chat.messages}
                      participants={this.getChatParticipants(chat)}
                      publicKey={account.publicKey || ''}
                      onSend={this.onMessageSend}
                      onFileUpload={this.onFileUpload}
                      onFileDownload={this.onFileDownload} /> :
                    null
          }
        </Col>
      </Row>
    );
  }
}

export default App;
