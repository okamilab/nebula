import React, { Component } from 'react';
import { Contacts, Chat, ExpandLess, ExpandMore } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';

import ContactList from './../contacts/components/ContactList';
import ContactInvite from './../contacts/components/ContactInvite';
import ChatList from './../chats/components/ChatList';

class ControlPanel extends Component {
  state = {
    isContactsOpen: true,
    isChatsOpen: true,
  };

  render() {
    return (
      <List component="nav">
        <ListItem button onClick={() => { this.setState({ isContactsOpen: !this.state.isContactsOpen }) }}>
          <ListItemIcon>
            <Contacts />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
          <ListItemSecondaryAction style={{ paddingRight: 20 }}>
            <ContactInvite />
          </ListItemSecondaryAction>
          <span>
            {this.state.isContactsOpen ? <ExpandLess /> : <ExpandMore />}
          </span>
        </ListItem>
        <Collapse in={this.state.isContactsOpen} unmountOnExit>
          <ContactList />
        </Collapse>
        <ListItem button onClick={() => { this.setState({ isChatsOpen: !this.state.isChatsOpen }) }}>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="Chats" />
          {this.state.isChatsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.isChatsOpen} unmountOnExit>
          <ChatList />
        </Collapse>
      </List>
    );
  }
}

export default ControlPanel;