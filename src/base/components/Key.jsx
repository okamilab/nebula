import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';

import copy from './../../images/copy.svg';

class Key extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
      copied: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
      copied: this.state.tooltipOpen
    });
  }

  render() {
    const { name, value } = this.props;

    if (!value || !value.length) {
      return null;
    }

    return (
      <React.Fragment>
        <span>
          {
            value.length > 16 ?
              value.substr(0, 10) + '...' + value.substr(value.length - 4) :
              value
          }
        </span>
        <CopyToClipboard
          id={name + '_key'}
          text={value}
          onCopy={() => this.setState({ copied: true })}
          style={{ cursor: 'pointer', width: 16, marginLeft: 10 }}>
          <img src={copy} alt='Copy to clipboard' />
        </CopyToClipboard>
        <Tooltip
          placement='top'
          isOpen={this.state.tooltipOpen}
          target={name + '_key'}
          toggle={this.toggle}>
          {this.state.copied ? 'Copied' : 'Copy to clipboard'}
        </Tooltip>
      </React.Fragment>
    )
  }
}

export default Key;