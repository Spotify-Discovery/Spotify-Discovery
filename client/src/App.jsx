import React from 'react';
import axios from 'axios';
import Home from './components/Home.jsx';
import SongList from './components/SongList.jsx';
import RecommendedModal from "./components/RecommendedModal.jsx";
import Dashboard from './components/Dashboard.jsx';
import Search from './components/Search.jsx'
const {useState, useEffect, Suspense} = React;
import { setTokens } from './actions/setTokens.js';
import { refreshAccessToken } from './actions/refreshAccessToken.js'
const mediaPlayer = new Audio();
mediaPlayer.volume = 0.5;

const App = (props) => {
  const params = new URLSearchParams(window.location.search);
  const access_token = params.get('access_token');
  const [results, setResults] = useState([]);
  const [view, setView] = useState('Login');
  const [userInfo, setUserInfo] = useState({});
  const [currentRelated, setCurrentRelated] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (params.get('access_token')) {
      props.setTokens(params.get('access_token'), params.get('refresh_token'));
      setView('Home')
      axios({
        method: 'get',
        url: `./userInfo/${access_token}`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        console.log('userInfo:', res.data)
        setUserInfo(res.data);
      })
    }
  }, [])

  const handleClick = () => {
    axios.get('/login')
      .then((res) => {
        console.log(res.data)
      })
  }

  const playPreview = (song) => {
    if (!mediaPlayer.paused) {
      mediaPlayer.pause();
    }
    if (song.preview_url) {
      mediaPlayer.src = song.preview_url;
      mediaPlayer.play();
    } else {
        axios({
          method: 'get',
          url: `./preview?token=${access_token}&isrc=${song.external_ids.isrc}&country=${userInfo.info.country}`,
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then((res) => {
          console.log('response:', res.data)
          if (res.data.preview_url) {
            mediaPlayer.src = res.data.preview_url;
            mediaPlayer.play();
          }
        })
    }

  }

  const pausePreview = () => {
    mediaPlayer.pause();
    console.log('pausing');
    mediaPlayer.src = '';
  }

  const handleSearch = (query) => {
    const body = JSON.stringify({q: query})
    axios({
      method: 'post',
      url: `./search/${access_token}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    })
    .then((res) => {
      setView('Search')
      console.log(res.data)
      setResults(res.data.tracks.items)
    })
  }

  const handleViewChange = (option) => {
    setView(option)
  }

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  const getAccessToken = () => {
    return access_token;
  }

  const getRelated = (id) => {
    console.log(id);
    axios({
      method: 'get',
      url: `./related?token=${access_token}&track_id=${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log('got related:', res.data)
      setCurrentRelated(res.data);
      if (!isOpen) {
        setIsOpen(true);
      }
    })
  }

  const renderView = () => {
    switch (view) {
      case "Login":
        return (
          <div className="center">
            <div className="title">Discover<e id="spotify-title">Spotify</e></div>
            <a className="login-button"
              href={'./login'}>Login to Spotify</a>
          </div>
        );
      case "Home":
        return (
            <Home handleViewChange={handleViewChange} handleSearch={handleSearch} />
        );
      case "Dashboard":
        {console.log(props)}
        return (
          <Dashboard getRelated={getRelated} getAccessToken={getAccessToken} userInfo={userInfo} handleViewChange={handleViewChange} playPreview={playPreview} pausePreview={pausePreview} handleSearch={handleSearch}/>
        );
      case "Search":
        return (
          <div>
            <Search handleViewChange={handleViewChange} handleSearch={handleSearch}/>
            <SongList playPreview={playPreview} pausePreview={pausePreview} getRelated={getRelated} results={results}/>
          </div>
        )
      default:
        return <div>404</div>;

    }
  }

  return (
    <main>
      <RecommendedModal playPreview={playPreview} pausePreview={pausePreview} getRelated={getRelated} open={isOpen} recommended={currentRelated} toggleModal={toggleModal}/>
      <Suspense fallback={<p>Loading...</p>}>{renderView()}</Suspense>
    </main>
  )
}

export default App;