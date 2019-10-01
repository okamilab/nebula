import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Helmet from 'react-helmet-async';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Layout from './base/containers/Layout';
// import Home from './base/pages/Home';
import Settings from './settings/pages/Settings';
import Profile from './account/pages/Profile';
import Messenger from './messenger';
import Contact from './messenger/contacts/pages/Contact';
import Chat from './messenger/chats/pages/Chat';
import ControlPanel from './messenger/components/ControlPanel';

import Startup from './base/containers/Startup';
import './App.css';

function App({ settings }) {
  const theme = useTheme();
  const isNarrow = !useMediaQuery(theme.breakpoints.up('md')) || settings.mode === 'narrow';

  return (
    <Startup>
      <Helmet titleTemplate='Nebula - %s' />
      <Layout isNarrow={isNarrow}>
        <Switch>
          {/* <Route exact path={settings.home} component={Home} /> */}
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/profile' component={Profile} />
          {/* <Route exact path='/messenger' render={(props) => (<Messenger {...props} isNarrow={isNarrow} />)} /> */}
          <Route exact path='/' render={(props) => (<Messenger {...props} isNarrow={isNarrow} />)} />
          <Route exact path='/messenger/contact/:key' render={(props) => (<Contact {...props} isNarrow={isNarrow} />)} />
          <Route exact path='/messenger/chat/:key' render={(props) => (<Chat {...props} isNarrow={isNarrow} />)} />
          <Route exact path='/messenger/control' render={(props) => (<ControlPanel {...props} isNarrow={isNarrow} />)} />
        </Switch>
      </Layout>
    </Startup>
  );
}

App.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default compose(
  connect((state) => {
    const { settings } = state || {
      settings: {
        mode: 'full',
        home: '/'
      }
    };
    return { settings };
  })
)(App);