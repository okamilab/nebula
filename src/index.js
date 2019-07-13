import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import './index.css';
import { configureStore, history } from './base/redux';
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = configureStore({});

ReactDOM.render(
  <AppContainer>
    <HelmetProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router>
            <App />
          </Router>
        </ConnectedRouter>
      </Provider>
    </HelmetProvider>
  </AppContainer>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
