import Redux from 'redux';

const initialState = {}

var tokensReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOKENS':
      return {
        access_token: action.access_token,
        refresh_token: action.refresh_token
      }
    case 'REFRESH_ACCESS_TOKEN':
      return {
        ...state,
        access_token: action.access_token
      }
    default:
      return state;
  }
};

export default tokensReducer;