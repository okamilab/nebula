import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router';
import Helmet from 'react-helmet-async';

import Main from './Main';
import Layout from './base/containers/Layout';

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
        </Switch>
      </Layout>
    </Fragment>
  );
}