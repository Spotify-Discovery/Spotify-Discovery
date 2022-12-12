import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './../reducers/index.js';

const configureStore = () => {
  return createStore(rootReducer,
    {
      tokens: null,
    },
    applyMiddleware(thunk));
};

export default configureStore();