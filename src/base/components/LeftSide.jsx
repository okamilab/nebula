import React, { Component, Fragment } from 'react';
import { Nav, NavItem } from 'reactstrap';

import Account from './../../account/components/Account';
import ContactsIcon from './ContactsIcon';
import ChatsIcon from './ChatsIcon';
import ContactList from './../../contacts/components/ContactList';
import ChatList from './../../chats/components/ChatList';

class LeftSide extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedChat: false
    };
  }

  render() {
    const { selectedChat } = this.state;
    const activeContactsStyle = !selectedChat ? { background: '#282c34' } : {};
    const activeChatsStyle = selectedChat ? { background: '#282c34' } : {};

    return (
      <Fragment>
        <Account />
        <Nav style={{ borderBottom: '3px solid #282c34' }} className='pt-4' fill>
          <NavItem
            className='p-2'
            style={{ ...activeContactsStyle, cursor: 'pointer' }}
            onClick={() => { this.setState({ selectedChat: false }) }}>
            <ContactsIcon active={!selectedChat} />
          </NavItem>
          <NavItem
            className='p-2'
            style={{ ...activeChatsStyle, cursor: 'pointer' }}
            onClick={() => { this.setState({ selectedChat: true }) }}>
            <ChatsIcon active={selectedChat} />
          </NavItem>
        </Nav>
        {
          selectedChat ?
            <ChatList /> :
            <ContactList />
        }
      </Fragment >
    );
  }
}

export default LeftSide;