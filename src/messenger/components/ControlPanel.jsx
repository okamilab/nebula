import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Contacts, Chat } from '@material-ui/icons';

import ContactList from './../contacts/components/ContactList';
import ChatList from './../chats/components/ChatList';

class ControlPanel extends Component {
  state = {
    value: 0,
  };

  handleChange = (_, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <>
        <Tabs
          value={this.state.value}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          <Tab icon={<Contacts />} label="Contacts" />
          <Tab icon={<Chat />} label="Chats" />
        </Tabs>
        {
          this.state.value ?
            <ChatList /> :
            <ContactList />
        }
      </>
    );
  }
}

export default ControlPanel;