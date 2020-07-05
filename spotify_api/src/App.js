import React, { Component } from 'react';
import './App.css';
//source in spotify api framework
import Spotify from "spotify-web-api-js";
//define class of new Spotify into spotifyWebApi
import RandomSong from "./random-song/random-song"
const spotifyWebApi = new Spotify();

class App extends Component {
  //reruns nowPlaying and forces an update every 20 seconds to keep current song displaying
  
  render() {
    //grabs artists info from getRelatedArtists, saves to varable.
  return (
    <div className="App">
      <RandomSong />
    </div>
  );
  }
}

export default App;
