import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import sum from 'hash-sum';
import { push } from 'connected-react-router';

import ContactListGroup from './ContactListGroup';
import ContactRequest from './ContactRequest';
import Identicon from './../../../base/components/Identicon';
import { groupBy } from './../../../base/fn';

const styles = _ => ({
});

class ContactList extends Component {
  render() {
    const { contacts, dispatch } = this.props;
    const map = groupBy(Object.values(contacts), 'type');

    return (
      <>
        <ContactListGroup list={map['sent_request']} title='Sent' />
        <ContactListGroup
          list={map['received_request']}
          title='Received'
          renderItem={(c, i) => <ContactRequest key={i} publicKey={c.key} address={c.address} />} />
        <ContactListGroup
          list={map['added']}
          title='Contacts'
          renderItem={(c, i) =>
            <ListItem key={i} button
              onClick={() => { dispatch(push(`/messenger/contact/${sum(c.key)}`)) }}>
              <ListItemIcon>
                <Identicon publicKey={c.key} size={32} />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography color='inherit' noWrap>
                    {c.username || c.key}
                  </Typography>
                } />
            </ListItem>
          }>
        </ContactListGroup>
      </>
    );
  }
}

ContactList.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  contacts: PropTypes.object,
};

export default compose(
  connect((state) => {
    const { contacts } = state || {};
    return { contacts };
  }),
  withStyles(styles)
)(ContactList);