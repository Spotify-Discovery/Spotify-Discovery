import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles.css";

import App from './App.jsx'

import configureStore from './store/store.js';

import { Provider, connect } from 'react-redux';

import setTokens from './actions/setTokens.js';
import refreshAccessToken from './actions/refreshAccessToken.js';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

const store = configureStore;

const mapStateToProps = (state) => {
  console.log(state);
  return {
    access_token: state.tokens.access_token,
    refresh_token: state.tokens.refresh_token
  };
};

const mapDispatchToProps = (dispatch) => ({
  setTokens: (access_token, refresh_token) => {
    dispatch(setTokens(access_token, refresh_token));
  },
  refreshAccessToken: (refresh_token) => {
    dispatch(refreshAccessToken(refresh_token));
  }
});

var AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

root.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>
);