import React, { useState, useRef } from "react";
//import style
import "./styles/app.scss";
//import components
import Player from "./components/Player";
import Song from "./components/Song";
import data from "./data";
import Library from "./components/Library";
import Nav from "./components/Nav";

function App() {
  /**
   *make a initial current time and duration time inside songInfo variable
   */
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  /**
   * first make null audioRef, then make ref in <audio> tag
   */
  const audioRef = useRef(null);
  //store data inside songs variable
  const [songs, setSongs] = useState(data());
  //after storing data we have access 1 no index
  const [currentSong, setCurrentSong] = useState(songs[0]);
  //default make false isPlaying.
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * if timeUpdateHangler this is onTimeUpdate hangler inside audio tag
   * remember audio tag have ref with the play button handler mean if some one
   * click the play button then call the event hangler then click handler refer the audio
   * then we have initial currentTime and duration null inside songInfo variable
   * first target the current time and duration from the audio file.
   * then setSongInfo ...songInfo mean both variable from the beginning,
   * then set then value with currentTime and duration.
   */
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //calculate percentage
    const roundCurrent = Math.round(current);
    const roundDuration = Math.round(duration);
    const animation = Math.round((roundCurrent / roundDuration) * 100);

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };
  const [libraryStatus, setlibraryStatus] = useState(false);

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setlibraryStatus={setlibraryStatus} />
      <Song currentSong={currentSong} />
      {/* pass the variable for access with another components */}
      <Player
        setSongs={setSongs}
        songs={songs}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
      />
      <Library
        libraryStatus={libraryStatus}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
      />

      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
