import React from 'react'
const {useState} = React;
const TopListEntry = ({item, place}) => {
  const pictureStyle = {
    backgroundImage: `url(${item.images[2].url})`,
    height: '150px',
    width: '150px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '20px'
  }
  const containerStyle = {
    backgroundImage: `url(${item.images[1].url})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }

  return (
    <div className="top-entry" style={containerStyle}>
      <div className="black-filter"></div>
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        <div className="item-details">{item.genres[0]}</div>
        <div className="item-popularity">{'Popularity ' + item.popularity}</div>
      </div>
    </div>
  )
}

export default TopListEntry;