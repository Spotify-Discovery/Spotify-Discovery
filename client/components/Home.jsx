import React from 'react'
import Search from './Search.jsx'
const {useRef, useState} = React;

const Home = ({handleSearch, handleViewChange}) => {
  const searchRef = useRef('');
  const [firstSearch, setFirstSearch] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (firstSearch) {setFirstSearch(false)}
    if (searchRef.current.value !== '') {
      handleSearch(searchRef.current.value);
      handleViewChange('Search')
    }
  }

  return (
    <div className="center">
        <div className="title">Discover<e id="spotify-title">Spotify</e></div>
        <form onSubmit={handleSubmit} autoComplete="off">
        <input ref={searchRef} id="search" placeholder="Search..."></input>
        <button id="search-button" className="fa-solid fa-magnifying-glass fa-lg" type="submit"></button>
      </form>
      <div className="text"> OR </div>
      <button onClick={() => {handleViewChange('Dashboard')}} className="dash-button">My Dashboard</button>
    </div>
  );
}

export default Home;