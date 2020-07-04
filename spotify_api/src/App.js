import React, { Component } from 'react';
import './App.css';
import Spotify from "spotify-web-api-js";

const spotifyWebApi = new Spotify();

class App extends Component {
  componentDidMount() {
    setInterval(() => {
      this.getNowPlaying();
      this.forceUpdate();
      console.log('force rerender')
    }, 20000);
  }
  constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        artist: '',
        album: '',
        image: '',
      },
      randomSong: {
        artist: 'artist',
        album: 'album',
        song: 'song',
        image: 'image',
        id: 'id',
      },
      relatedArtists: {
        artists: [],
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
            console.log('randomSong', response.tracks.items[randomIndex].external_urls.spotify)
            this.setState({
              randomSong: {
                artist: response.tracks.items[randomIndex].artists[0].name,
                album: response.tracks.items[randomIndex].album.name,
                song: response.tracks.items[randomIndex].name,
                image: response.tracks.items[randomIndex].album.images[0].url,
                id: response.tracks.items[randomIndex].artists[0].id,
                open: response.tracks.items[randomIndex].external_urls.spotify
              }
            })
            this.getRelatedArtists()
          }).catch ((error) => {
            console.log('song not found, rerunning');
            this.randomSong();

          });
        }

        getRelatedArtists() {
          spotifyWebApi.getArtistRelatedArtists(this.state.randomSong.id)
          .then((response) => {
            let artistsArray = [];
            for (let i = 0; i < response.artists.length; i++) {
              const element = response.artists[i];
              artistsArray.push(element.name)
            }
            this.setState({
              relatedArtists: {
                artists: artistsArray
              }
            })
          })
        }

        getNowPlaying() {
          spotifyWebApi.getMyCurrentPlaybackState()
          .then((response) => {
            console.log('getNowPlaying', response)
            if (!response) {
              return;
            }
            this.setState({
              nowPlaying: {
                name: response.item.name,
                artist: response.item.artists[0].name,
                album: response.item.album.name,
                image: response.item.album.images[0].url
              }
            })
          })
        }
  render() {
    // setInterval(() => {
    //   this.getNowPlaying()
    //   this.forceUpdate()
    // }, 20000);
    const { artists } = this.state.relatedArtists;
  return (
    <div className="App">
      <a href='http://localhost:8888'>
   <button>Login With Spotify</button>
   </a>
   <div>Now Playing: <ul>
     <li>Track: { this.state.nowPlaying.name }</li>
        <li>Artist: {this.state.nowPlaying.artist}</li>
        <li>Album: {this.state.nowPlaying.album}</li>
     </ul></div>
   <div><img src={ this.state.nowPlaying.image } style={{ width: 100}}/></div>
      <button onClick={() => this.getNowPlaying()}>Get Now Playing</button>
   <button onClick={() => this.randomSong()}>Generate Random Song</button>
   <div>Artist: {this.state.randomSong.artist}</div>
   <div>Album: {this.state.randomSong.album}</div>
   <div>Track: {this.state.randomSong.song}</div>
   <div><img src={this.state.randomSong.image} style={{ width: 100 }} /></div>
   <a href={this.state.randomSong.open} target='_blank'><button>Open this song in spotify</button></a>
      <ul>Similar Artists:{artists.map((artist, index) => { return <li key={index}>{artist}</li>})}</ul>
    </div>
  );
  }
}

export default App;
