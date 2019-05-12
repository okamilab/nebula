import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Contacts, Chat } from '@material-ui/icons';

import ContactList from './../contacts/components/ContactList';
import ChatList from './../chats/components/ChatList';

const styles = {
  root: {
    flexGrow: 1,
    maxWidth: 500,
    height: '100%'
  },
};

class LeftSide extends Component {
  state = {
    value: 0,
  };

  handleChange = (_, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper square className={classes.root}>
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
      </Paper>
    );
  }
}

export default withStyles(styles)(LeftSide);