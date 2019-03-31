import React, { Fragment } from 'react';
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
      <Fragment >
        {this.props.children}
      </Fragment>
    );
  }
}

export default connect()(Startup)