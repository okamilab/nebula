import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

class WsConnection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.app.connected && nextProps.app.connected && !this.state.isOpen) {
      this.setState({ isOpen: true });
      setTimeout(() => { this.setState({ isOpen: false }) }, 3000);
    }
  }

  render() {
    const { app } = this.props;

    return (
      <div className="fixed-top pt-2 pr-2">
        <div className="text-center" style={{ width: 200, margin: "0 auto" }}>
          <Alert color="success" isOpen={this.state.isOpen}>Connected</Alert>
          {app.connected ? null : <Alert color="danger">No connection</Alert>}
        </div>
      </div>
    );
  }
}

export default compose(
  connect((state) => {
    const { app } = state || {
      connected: false
    };
    return { app };
  })
)(WsConnection);