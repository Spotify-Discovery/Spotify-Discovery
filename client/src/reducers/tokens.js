import Redux from 'redux';

const initialState = {
  access_token: null,
  refresh_token: null
}

var tokensReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
    case 'SET_TOKENS':
      return action.tokens;
    case 'REFRESH_ACCESS_TOKEN':
      return action.tokens;
  }
};

export default tokensReducer;