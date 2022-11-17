import React from 'react'
import SongEntry from './SongEntry.jsx';
import RecommendedModal from "./RecommendedModal.jsx";
const {useRef, useState} = React;

const SongList = ({results, getRelated, pausePreview, playPreview}) => {
  const searchRef = useRef('');

  return results ? (
    <div className="song-list">
      {results.map((track, i) => {
        return <SongEntry key={i} pausePreview={pausePreview} playPreview={playPreview} getRelated={getRelated} track={track}/>
      })}
    </div>
  ): null;
}

export default SongList;