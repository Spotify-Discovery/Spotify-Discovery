const refreshAccessToken = (access_token) => ({
  type: "REFRESH_ACCESS_TOKEN",
  access_token: access_token
});

export default refreshAccessToken;