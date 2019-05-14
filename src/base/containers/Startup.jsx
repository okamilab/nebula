import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { connect as connectApp } from '../../app/actions';

class Startup extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(connectApp());
  }

  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }
}

export default connect()(Startup)