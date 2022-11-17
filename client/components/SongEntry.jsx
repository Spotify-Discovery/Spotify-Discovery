import React from 'react';

const SongEntry = ({track, getRelated, pausePreview, playPreview}) => {

  const albumArtStyles = (url) => {
    return {
      height: '100px',
      width: '100px',
      backgroundImage: `url(${url})`,
      backgroundSize: 'contain',
      float: 'left',
      marginRight: '10px'
    }
  };

  const handleTrackClick = () => {
    console.log('clicked on:', track.name, 'id:', track.id);
    getRelated(track.id)
  }

  return (
    <div className="track"
      onClick={() => {
        handleTrackClick();
        pausePreview();
      }}
      onMouseEnter={() => {playPreview(track)}}
      onMouseLeave={() => {pausePreview()}}
    >
      <div style={albumArtStyles(track.album.images[1].url)}></div>
      <div className="song-info">
        <div className="song-name">{track.name}</div>
        <div className="song-artist">{track.artists[0].name}</div>
      </div>
    </div>
  )
};

export default SongEntry;