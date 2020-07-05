import React, { Component } from 'react';
import './App.css';
//source in spotify api framework
import Spotify from "spotify-web-api-js";
import { HashRouter as Router, Switch, Route, NavLink } from "react-router-dom";
//define class of new Spotify into spotifyWebApi
import RandomSong from "./random-song/random-song"
import Recommendations from "./recommendations/recommendations"
const spotifyWebApi = new Spotify();

class App extends Component {
  //reruns nowPlaying and forces an update every 20 seconds to keep current song displaying
  
  render() {
    let queryString = window.location.href;
    let queryPosition = queryString.search("access_token=")
    queryString = queryString.slice(queryPosition)
    console.log("queryString", queryString);
    //grabs artists info from getRelatedArtists, saves to varable.
  return (
    <div className="App">
      <Recommendations />
      <RandomSong />
    </div>
  );
  }
}

export default App;
