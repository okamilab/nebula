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

    return (
      <Fragment>
        <Account />
        <Nav className='left-nav pt-4' fill>
          <NavItem
            className={'left-nav-item p-2' + (!selectedChat ? ' active' : '')}
            onClick={() => { this.setState({ selectedChat: false }) }}>
            <ContactsIcon active={!selectedChat} />
          </NavItem>
          <NavItem
            className={'left-nav-item p-2' + (selectedChat ? ' active' : '')}
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