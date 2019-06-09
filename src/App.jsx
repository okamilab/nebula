import React from 'react';
import { Switch, Route } from 'react-router';
import Helmet from 'react-helmet-async';

import Layout from './base/containers/Layout';
import Home from './base/pages/Home';
import Settings from './settings/pages/Settings';
import Profile from './account/pages/Profile';
import Messenger from './messenger';
import Contact from './messenger/contacts/pages/Contact';
import Chat from './messenger/chats/pages/Chat';
import Browser from './browser/Browser';

import Startup from './base/containers/Startup';
import './App.css';

export default function App() {
  return (
    <Startup>
      <Helmet titleTemplate='Nebula - %s' />
      <Layout>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/messenger' component={Messenger} />
          <Route exact path='/messenger/contact/:key' component={Contact} />
          <Route exact path='/messenger/chat/:key' component={Chat} />
          <Route exact path='/browser' component={Browser} />
        </Switch>
      </Layout>
    </Startup>
  );
}