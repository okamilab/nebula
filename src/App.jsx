import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router';
import Helmet from 'react-helmet-async';

import Layout from './base/containers/Layout';
import Home from './base/pages/Home';
import Settings from './settings/pages/Settings';
import Profile from './account/pages/Profile';
import Contact from './contacts/pages/Contact';
import Chat from './chats/pages/Chat';

import './App.css';

export default function App() {
  return (
    <Fragment>
      <Helmet titleTemplate='Nebula - %s' />
      <Layout>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/contact/:key' component={Contact} />
          <Route exact path='/chat/:key' component={Chat} />
        </Switch>
      </Layout>
    </Fragment>
  );
}