require("dotenv").config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

/************************************************************
*************ENVIRONMENT VARIABLES AND CONSTANTS*************
*************************************************************/
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_HOME_URL = process.env.CLIENT_HOME_URL;
const STATE_KEY = 'spotify_auth_state';
const SPOTIFY_AUTH = 'https://accounts.spotify.com/authorize';

// Scope of permissions being asked of user
const SCOPES = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-email',
  'user-read-private',
];

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/************************************************************
***************************ROUTES****************************
*************************************************************/

/**
 * Endpoint for logging in.  Redirects to Spotify's auth page.
 */
router.get('/login', (req, res) => {
  let state = generateRandomString(16);
  res.cookie(STATE_KEY, state);

  let scopeParam = '';

  // Build scope param
  SCOPES.forEach(scope => {
    scopeParam += scope + ' ';
  });

  res.redirect(`${SPOTIFY_AUTH}?` +
    new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopeParam,
      redirect_uri: REDIRECT_URI,
      state: state,
      show_dialog: true,
    })
  );
});

/**
 * Endpoint for trading code from Spotify's auth page for an access and refresh token
 */
router.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (storedState !== state || state === null) {
    res.redirect(`${CLIENT_HOME_URL}?` +
      new URLSearchParams({
        error: 'state_mismatch'
      })
    );
  } else {

    res.clearCookie(STATE_KEY);

    var authOptions = new URLSearchParams({
      code: code,
      redirect_uri: REDIRECT_URI,
      'grant_type':'authorization_code'
    })

    const headers = {
      headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    axios.post('https://accounts.spotify.com/api/token', authOptions, headers)
      .then((response) => {
        if (response.status === 200) {
          const access_token = response.data.access_token;
          const refresh_token = response.data.refresh_token;

          res.redirect(`${CLIENT_HOME_URL}?` +
            new URLSearchParams({
              access_token: access_token,
              refresh_token: refresh_token
            })
          );
        } else {
          res.redirect(`${CLIENT_HOME_URL}?` +
            new URLSearchParams({
              error: 'invalid_token'
            }));
        }
      })
      .catch((error) => {
        res.redirect(`${CLIENT_HOME_URL}?` +
          new URLSearchParams({
            error: 'internal_server_error'
          }));
      });
  }
});

/**
 * Endpoint for refreshing access token.
 */
router.get('/refresh/:refresh_token', function(req, res) {

  const refresh_token = req.params.refresh_token;

  const authOptions = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  });

  const headers = {
    headers: {
      'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    }
  };

  axios.post('https://accounts.spotify.com/api/token', authOptions, headers)
    .then(response => {
      if (response.status === 200) {
        const access_token = response.data.access_token;
        res.send({
          'access_token': access_token
        });
      } else {
        res.status(500).send(response);
      }
    })
    .catch((error) => {
      res.redirect(`${CLIENT_HOME_URL}?` +
        new URLSearchParams({
          error: 'internal_server_error'
        }));
    });
});

module.exports = router;