import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ContactInvite from './ContactInvite';

class ContactList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
  };

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  render() {
    const groupedList = this.groupBy(this.props.list, 'type');

    return (
      <div className="pt-3">
        <h5>
          All
          <ContactInvite onRequest={this.props.onContactRequest} />
        </h5>
        <Group list={groupedList['sent_request']} title="Sent"></Group>
        <Group list={groupedList['received_request']} title="Received"></Group>
        <Group list={groupedList['added']}></Group>
      </div>
    );
  }
}

export default ContactList;

class Group extends Component {
  static propTypes = {
    list: PropTypes.array,
    title: PropTypes.string,
  };

  render() {
    if (!this.props.list || !this.props.list.length) {
      return null;
    }

    return (
      <Fragment>
        <h6>{this.props.title}</h6>
        {
          this.props.list.map((c, i) => {
            return (
              <div key={i} className="text-truncate">{c.key}</div>
            );
          })
        }
      </Fragment>
    );
  }
}