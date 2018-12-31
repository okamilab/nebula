import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router';
import Helmet from 'react-helmet-async';

import Layout from './base/containers/Layout';
import Main from './Main';
import Settings from './settings/pages/Settings';
import Profile from './account/pages/Profile';

import './App.css';

export default function App() {
  return (
    <Fragment>
      <Helmet titleTemplate="Swarm Messenger - %s">
        {/* <link rel="icon" href={favicon} type="image/png" /> */}
      </Helmet>
      <Layout>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/profile' component={Profile} />
        </Switch>
      </Layout>
    </Fragment>
  );
}