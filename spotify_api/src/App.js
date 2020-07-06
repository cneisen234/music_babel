import React, { Component } from 'react';
import './App.css';
//source in spotify api framework
import Spotify from "spotify-web-api-js";
import { HashRouter as Router, Switch, Route, NavLink } from "react-router-dom";
//define class of new Spotify into spotifyWebApi
import RandomSong from "./random-song/random-song"
import Recommendations from "./recommendations/recommendations"
import { connect } from 'react-redux';
import Header from "./Header/Header";
const spotifyWebApi = new Spotify();

//main App component, this acts as the parent for all components on page
class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' })
  }
  
  render() {
 
  return (
    <div className="App">
      <Header /> {/*Header page which includes login */}
      <Recommendations /> {/*Recommendations page */}
      <RandomSong /> {/*RandomSong page */}
    </div>
  );
  }
}

export default connect()(App);
