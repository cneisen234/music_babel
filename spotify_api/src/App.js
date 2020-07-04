import React, { Component } from 'react';
import './App.css';
import Spotify from "spotify-web-api-js";

const spotifyWebApi = new Spotify();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      },
      randomSong: {
        artist: 'artist',
        album: 'album',
        song: 'song',
        image: 'image',
      }
    }
    if (params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }
     getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }


 getRandomSearch = () => {
  // A list of all characters that can be chosen.
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  // Gets a random character from the characters string.
  const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
  let randomSearch = '';

  // Places the wildcard character at the beginning, or both beginning and end, randomly.
  switch (Math.round(Math.random())) {
    case 0:
      randomSearch = randomCharacter + '%';
      break;
    case 1:
      randomSearch = '%' + randomCharacter + '%';
      break;
  }

  return randomSearch;
}

  // getRandomCountry = () => {
  //   // A list of all characters that can be chosen.
  //   const characters1 = 'abcdefghijklmnopqrstuvwxyz';
  //   const charecters2 = 'abcdefghijklmnopqrstuvwxyz'

  //   // Gets a random character from the characters string.
  //   const randomCharacter1 = characters1.charAt(Math.floor(Math.random() * characters1.length));
  //   const randomCharacter2 = charecters2.charAt(Math.floor(Math.random() * charecters2.length));
  //   let randomSearch = randomCharacter1 + randomCharacter2;
  //  if (!randomSearch) {
  //    randomSearch = 'us'
  //  }
  

  //   return randomSearch;
  // }

        randomSong() {
          let countries = ['AD', 'AR', 'AU', "AT", 'BE', 'BO', 'BR', 'BG', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO',
            'EC', 'SV', 'EE', 'FI', 'FR', 'DE', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
            'MY', 'MT', 'MX', 'MC', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH',
            'TW', 'TR', 'GB', 'UY', 'US']
          const randomOffset = Math.floor(Math.random() * 2000);
          const randomIndex = Math.floor(Math.random() * 50);
          const randomCountry = Math.floor(Math.random() * countries.length);
          spotifyWebApi.searchTracks(this.getRandomSearch(), { limit: 50, offset: randomOffset, market: countries[randomCountry]})
          .then((response) =>{
            console.log(response.tracks.items[randomIndex])
            this.setState({
              randomSong: {
                artist: response.tracks.items[randomIndex].artists[0].name,
                album: response.tracks.items[randomIndex].album.name,
                song: response.tracks.items[randomIndex].name,
                image: response.tracks.items[randomIndex].album.images[0].url,
              }
            })
          })
        }

        getNowPlaying() {
          spotifyWebApi.getMyCurrentPlaybackState()
          .then((response) => {
            console.log(response)
            this.setState({
              nowPlaying: {
                name: response.item.name,
                image: response.item.album.images[0].url
              }
            })
          })
        }
  render() {
  return (
    <div className="App">
      <a href='http://localhost:8888'>
   <button>Login With Spotify</button>
   
   {JSON.stringify(this.state.randomSong)}
   </a>
   <div>Now Playing: { this.state.nowPlaying.name }</div>
   <div><img src={ this.state.nowPlaying.image } style={{ width: 100}}/></div>
   <button onClick={() => this.getNowPlaying()}>Check Now Playing</button>
   <button onClick={() => this.randomSong()}>Generate Random Song</button>
   <div>Artist: {this.state.randomSong.artist}</div>
   <div>Album: {this.state.randomSong.album}</div>
   <div>Track: {this.state.randomSong.song}</div>
   <div><img src={this.state.randomSong.image} style={{ width: 100 }} /></div>
    </div>
  );
  }
}

export default App;
