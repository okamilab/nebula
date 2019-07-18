import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import { Menu, Close } from '@material-ui/icons';
import { routerActions } from 'connected-react-router';
import { push } from 'connected-react-router';

const path = '/messenger/control';

function ControlPanelButton({ router, dispatch }) {
  const { location } = router;

  return (
    <>
      {location.pathname === path ?
        <IconButton edge='start' color='inherit' aria-label='Close'
          onClick={() => { dispatch(routerActions.goBack()) }}>
          <Close />
        </IconButton> :
        <IconButton edge='start' color='inherit' aria-label='Control panel'
          onClick={() => { dispatch(push(path)) }}>
          <Menu />
        </IconButton>
      }
    </>
  );
}

ControlPanelButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  router: PropTypes.object,
};

export default compose(
  connect((state) => {
    const { router } = state || {
      router: {
        location: {}
      }
    };
    return { router };
  })
)(ControlPanelButton);