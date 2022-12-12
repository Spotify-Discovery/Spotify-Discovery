import { combineReducers } from 'redux';
import tokens from './tokens.js';

var rootReducer = () => {
  return combineReducers({
    tokens
  });
};

export default rootReducer();