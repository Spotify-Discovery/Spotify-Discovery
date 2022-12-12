import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles.css";

import App from './App.jsx'

import configureStore from './store/store.js';

import { Provider } from 'react-redux';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

const store = configureStore;

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);