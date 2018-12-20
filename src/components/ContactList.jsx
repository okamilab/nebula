import React, { Component } from 'react';
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
    const groupedList = this.groupBy(this.props.list, 'status');

    return (
      <div className="pt-3">
        <h5>
          All
          <ContactInvite onRequest={this.props.onContactRequest} />
        </h5>
        <h6>Sent request</h6>
        {
          (groupedList['sent_request'] || []).map((c, i) => {
            return (
              <div key={i} className="text-truncate">{c.key}</div>
            );
          })
        }
      </div>
    );
  }
}

export default ContactList;