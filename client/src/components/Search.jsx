import React from 'react';
const {useState, useRef} = React;

const Search = ({handleSearch, handleViewChange, showDashboardButton}) => {
  const searchRef = useRef('');
  console.log(showDashboardButton)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchRef.current.value !== '') {
      handleSearch(searchRef.current.value);
    }
  }
  return (
    <div className="nav-container">
      <form onSubmit={handleSubmit} autoComplete="off">
        <input ref={searchRef} id="search" placeholder="Search..."></input>
        <button id="search-button" className="fa-solid fa-magnifying-glass fa-lg" type="submit"></button>
      </form>
      {showDashboardButton ? null : <button onClick={() => {handleViewChange('Dashboard')}} className="dash-button" id="dash-nav">My Dashboard</button> }
    </div>
  )
}

export default Search;
