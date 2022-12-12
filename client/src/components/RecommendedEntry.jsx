import React from 'react';

const RecommendedEntry = ({track, getRelated, setCurrentSong, playPreview, pausePreview}) => {

  const albumArtStyles = (url) => {
    return {
      height: '120px',
      width: '120px',
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
    <div style={albumArtStyles(track.album.images[1].url)} className="recommended-track"
    onClick={() => {
      handleTrackClick()
      setCurrentSong(null);
    }}
    onMouseEnter={() => {
      setCurrentSong(track)
    }}
    onMouseLeave={() => {
      setCurrentSong(null)
    }}
    >
      <div className="black-filter-small"></div>
    </div>
  )
};

export default RecommendedEntry;