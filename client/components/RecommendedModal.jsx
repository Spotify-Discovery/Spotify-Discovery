import React from 'react';
import RecommendedEntry from './RecommendedEntry.jsx';
const {useEffect, useState} = React;

const RecommendedModal = ({open, recommended, toggleModal, getRelated, pausePreview, playPreview}) => {
  const [currentRelated, setCurrentRelated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    if (nowPlaying) {
      playPreview(nowPlaying);
    } else {
      pausePreview();
    }
  }, [nowPlaying])

  const setCurrentSong = (song) => {
    setNowPlaying(song);
  }

  const nowPlayingArt = () => {
    // backgroundImage: `url(${nowPlaying.album.images[1].url})`
    if (!nowPlaying) { return null; }
    return {
      backgroundImage: `url(${nowPlaying.album.images[1].url})`,
      width: '300px',
      height: '300px'
    }
  }

  if (!open) return null
  return (
    <>
      <div className="modal-container" onClick={toggleModal}>
          </div>
          {nowPlaying ?
          <div className="now-playing">
            <div style={nowPlayingArt()}></div>
            <div
              className="item-name"
              style={{width: '300px', margin: '10px 0 10px 0'}}
              >{nowPlaying.name}
            </div>
            <div className="item-details" style={{width: '300px', marginBottom: '10px'}}>{nowPlaying.artists[0].name}</div>
          </div> : null}
        <div className="modal">
          <div className="top-header modal-header" onClick={e => {
            e.stopPropagation();
          }}>Recommended Tracks</div>
          <div className="recommended-list">
            {recommended.tracks.map((track) => {
              return <RecommendedEntry
                setCurrentSong={setCurrentSong}
                getRelated={getRelated}
                playPreview={playPreview}
                pausePreview={pausePreview}
                track={track}/>
            })}
          </div>
        </div>
    </>
  )
}

export default RecommendedModal;