import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { push } from 'connected-react-router';
import sum from 'hash-sum';

import Identicon from './../../../base/components/Identicon';

const styles = _ => ({
});

class ChatList extends Component {
  render() {
    const { chats, dispatch } = this.props;

    return (
      <List component="div" disablePadding>
        {
          Object.values(chats).map((c, i) =>
            <ListItem key={i} button
              onClick={() => { dispatch(push(`/messenger/chat/${sum(c.key)}`)) }}>
              <ListItemIcon>
                <Identicon publicKey={c.key} size={32} />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography color='inherit' noWrap>
                    {c.key}
                  </Typography>
                } />
            </ListItem>
          )
        }
      </List>
    );
  }
}

ChatList.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  chats: PropTypes.object,
};

export default compose(
  connect((state) => {
    const { chats } = state || {};
    return { chats };
  }),
  withStyles(styles)
)(ChatList);