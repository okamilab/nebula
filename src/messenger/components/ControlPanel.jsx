import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Contacts, Chat, ExpandLess, ExpandMore } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import MuiIconButton from '@material-ui/core/IconButton';

import ContactList from './../contacts/components/ContactList';
import ContactInvite from './../contacts/components/ContactInvite';
import ChatList from './../chats/components/ChatList';

const IconButton = withStyles({
  root: {
    transition: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }
})(MuiIconButton);

class ControlPanel extends Component {
  state = {
    isContactsOpen: true,
    isChatsOpen: true,
  };

  render() {
    return (
      <List component="nav">
        <ListItem
          button
          onClick={() => { this.setState({ isContactsOpen: !this.state.isContactsOpen }) }}>
          <ListItemIcon>
            <Contacts />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
          <ListItemSecondaryAction>
            <ContactInvite />
            <IconButton
              edge="end"
              size="small"
              onClick={() => { this.setState({ isContactsOpen: !this.state.isContactsOpen }) }}>
              {this.state.isContactsOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.isContactsOpen}>
          <ContactList />
        </Collapse>
        <ListItem button onClick={() => { this.setState({ isChatsOpen: !this.state.isChatsOpen }) }}>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="Chats" />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              size="small"
              onClick={() => { this.setState({ isChatsOpen: !this.state.isChatsOpen }) }}>
              {this.state.isChatsOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.isChatsOpen}>
          <ChatList />
        </Collapse>
      </List>
    );
  }
}

export default ControlPanel;