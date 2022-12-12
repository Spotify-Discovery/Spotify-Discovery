import React from 'react'
const {useState} = React;
const TopListEntry = ({item, place, playPreview, pausePreview, getRelated}) => {

  const containerStyle = {
    backgroundImage: `url(${item.album.images[1].url})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }

  const handleTrackClick = () => {
    console.log('clicked on:', item.name, 'id:', item.id);
    getRelated(item.id)
  }

  return (
    <div className="top-entry" style={containerStyle}
      onMouseEnter={() => {
        setTimeout(() => {
          playPreview(item)
        }, 300);
      }}
      onMouseLeave={() => {pausePreview()}}
      onClick={() => {
        handleTrackClick();
        pausePreview();
      }}
    >
      <div className="black-filter"></div>
      <div className="item-info" style={{width: '80%'}}>
        <div className="item-name">{item.name}</div>
        <div className="item-details">{item.artists[0].name}</div>
        <div className="item-popularity">{'Popularity ' + item.popularity}</div>
      </div>
    </div>
  )
}

export default TopListEntry;