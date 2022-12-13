var setTokens = (access_token, refresh_token) => ({
  type: 'SET_TOKENS',
  access_token: access_token,
  refresh_token: refresh_token
});

export default setTokens;