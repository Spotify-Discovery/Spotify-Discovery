import React from 'react'
import axios from 'axios'
import Search from './Search.jsx'
import TopListEntry from './TopListEntry.jsx';
import TopTrackEntry from './TopTrackEntry.jsx'
const {useRef, useState, useEffect} = React;

const Dashboard = ({handleSearch, handleViewChange, userInfo, getAccessToken, getRelated, playPreview, pausePreview}) => {
  const player = new Audio();
  player.volume = 0.5;
  const searchRef = useRef('');
  const [userTopArtists, setUserTopArtists] = useState([])
  const [userTopTracks, setUserTopTracks] = useState([])
  const [timeRangeArtist, setTimeRangeArtist] = useState('short_term');
  const [timeRangeTracks, setTimeRangeTracks] = useState('short_term');

  useEffect(() => {
    axios({
      method: 'get',
      url: `./topTracks?token=${getAccessToken()}&time_range=${timeRangeTracks}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log('toptracks:', res.data.items)
      setUserTopTracks(res.data.items)
    })
  },[timeRangeTracks])

  useEffect(() => {
    axios({
      method: 'get',
      url: `./topArtists?token=${getAccessToken()}&time_range=${timeRangeArtist}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res.data.items)
      setUserTopArtists(res.data.items)
    })
  },[timeRangeArtist])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchRef.current.value !== '') {
      handleSearch(searchRef.current.value);
    }
  }

  const getTimeRangeStyle = (time) => {
    if (timeRangeArtist === time) {
      return (
        {opacity: 1}
      )
    }
  }

  const getTimeRangeStyleTracks = (time) => {
    if (timeRangeTracks === time) {
      return (
        {opacity: 1}
      )
    }
  }



  return userInfo ? (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input ref={searchRef} id="search" placeholder="Search..."></input>
        <button id="search-button" className="fa-solid fa-magnifying-glass fa-lg" type="submit"></button>
      </form>

    <div className="dashboard-main">

      <div style={{width: 'fit-content'}}>
        <div className="header-container">
          <div className="top-header">Top Artists</div>
          <div className="header-container">
            <div
              className="time-range"
              style={getTimeRangeStyle('short_term')}
              onClick={() => {setTimeRangeArtist('short_term')}}>
                Last Month
            </div>
            <div
              className="time-range"
              style={getTimeRangeStyle('medium_term')}
              onClick={() => {setTimeRangeArtist('medium_term')}}>
                Last 6 Months
            </div>
            <div
              className="time-range"
              style={getTimeRangeStyle('long_term')}
              onClick={() => {setTimeRangeArtist('long_term')}}>
                All Time
            </div>
          </div>
        </div>
        <div className="top-artists-container">
          {userTopArtists.map((artist, i) => {
            return <TopListEntry item={artist} key={i} place={i + 1}/>
          })}
        </div>
      </div>

      <div style={{width: '30%'}}>
      <div className="header-container">
          <div className="top-header">Top Tracks</div>
          <div className="header-container">
            <div
              className="time-range"
              style={getTimeRangeStyleTracks('short_term')}
              onClick={() => {setTimeRangeTracks('short_term')}}>
                Last Month
            </div>
            <div
              className="time-range"
              style={getTimeRangeStyleTracks('medium_term')}
              onClick={() => {setTimeRangeTracks('medium_term')}}>
                Last 6 Months
            </div>
            <div
              className="time-range"
              style={getTimeRangeStyleTracks('long_term')}
              onClick={() => {setTimeRangeTracks('long_term')}}>
                All Time
            </div>
          </div>
        </div>
        <div className="top-artists-container" id="top-tracks">
          {userTopTracks.map((track, i) => {
            return <TopTrackEntry
              getRelated={getRelated}
              playPreview={playPreview}
              pausePreview={pausePreview}
              item={track} key={i} place={i + 1}/>
          })}
        </div>
      </div>
    </div>
    </div>
  ) : null;
}

export default Dashboard;