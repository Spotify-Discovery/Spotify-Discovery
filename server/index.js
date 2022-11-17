require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const request = require('request');
const axios = require('axios');
const cookieParser = require('cookie-parser')
const queryString = require('query-string');

const STATE_KEY = 'spotify_auth_state';
const SPOTIFY_BASE = 'https://api.spotify.com/v1/';
const CALLBACK_URI = 'http://localhost:3000/callback';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
var AUTH;
const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
app.use(cors())
.use(cookieParser());


const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(express.static(path.join(__dirname, '../dist')))

app.get('/login', (req, res) => {
  var state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: CALLBACK_URI,
      state: state,
      show_dialog: true
    }));
})

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    res.redirect(`http://localhost:3000?` +
      queryString.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(STATE_KEY);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: CALLBACK_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    }
    // console.log(authOptions)
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      res.redirect(`http://localhost:3000?` +
          queryString.stringify({
          access_token: access_token,
          refresh_token: refresh_token
          }));
      } else {
      res.redirect(`$http://localhost:3000?` +
          queryString.stringify({
          error: 'invalid_token'
          }));
      }
  })
});

app.post('/search/:token', (req, res) => {
  const access_token = req.params.token;
  const query = req.body.q.split(" ").join("%20");
  console.log(query)
  axios.get(`${SPOTIFY_BASE}search?type=track&q=${query}`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })
  .then((result) => {
    // console.log('got: ', result);
    res.send(result.data)
  })
  .catch((err) => {
    console.log(err)
  })
})

app.get('/preview:token?:isrc?:country?', (req, res) => {
  const access_token = req.query.token;
  const isrc = req.query.isrc;
  const country = req.query.country;
  // console.log('preview:', access_token, track_id, country)
  // console.log('trackid:', track_id)
  // console.log('country:', country)

  axios.get(`${SPOTIFY_BASE}search?q=isrc:${isrc}&type=track&limit=1`,
  {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  }).then((result) => {
    res.send(result.data.tracks.items[0])
  })
  .catch(err => console.log(err))
})

app.get('/related:token?:track_id?', (req, res) => {
  const access_token = req.query.token;
  const track_id = req.query.track_id;
  axios.get(`${SPOTIFY_BASE}recommendations?seed_tracks=${track_id}&limit=40&market=US`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })
  .then((result) => {
    res.send(result.data);
  })
  .catch((err) => {
    console.log(err);
  })
})

app.get('/userInfo/:token', (req, res) => {
  console.log('getting userInfo')
  const access_token = req.params.token;
  const userData = {
    display_name: '',
    info: {},
    top_artist: [],
    top_tracks: []
  }
  const userInfo = axios.get(`${SPOTIFY_BASE}me`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })
  const topArtists = axios.get(`${SPOTIFY_BASE}me/top/artists`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })
  const topTracks = axios.get(`${SPOTIFY_BASE}me/top/tracks`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })

  axios
    .all([userInfo, topArtists, topTracks])
    .then(
      axios.spread((...responses) => {
        userData.display_name = responses[0].data.display_name;
        userData.info = responses[0].data;
        userData.top_artist = responses[1].data.items;
        userData.top_tracks = responses[2].data.items;
        res.send(userData)
      })
    )
    .catch((err) => {
      console.log(err)
    })
})

app.get('/topArtists:token?:time_range?', (req, res) => {
  const access_token = req.query.token;
  const time_range = req.query.time_range;
  console.log(time_range)
  axios.get(`${SPOTIFY_BASE}me/top/artists?time_range=${time_range}`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })
  .then((result) => {
    res.send(result.data)
  })
})

app.get('/topTracks:token?:time_range?', (req, res) => {
  const access_token = req.query.token;
  const time_range = req.query.time_range;
  console.log(time_range)
  axios.get(`${SPOTIFY_BASE}me/top/tracks?time_range=${time_range}`, {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })
  .then((result) => {
    res.send(result.data)
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})