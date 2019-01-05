import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import { dismissError } from './../actions';

class Error extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    errors: PropTypes.array,
  };

  render() {
    const { errors } = this.props;

    return (
      <div className="fixed-top pt-2 pr-2"
        style={{ left: 'auto' }}>
        {
          errors.map((error, i) =>
            <Alert color="danger" key={i} toggle={() => this.dismiss(error)}>
              {error}
            </Alert>
          )
        }
      </div>
    );
  }

  dismiss(error) {
    this.props.dispatch(dismissError(error));
  }
}

export default compose(
  connect((state) => {
    const { errors } = state || [];
    return { errors };
  })
)(Error);