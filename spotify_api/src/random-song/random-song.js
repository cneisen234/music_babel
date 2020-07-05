import React, { Component } from "react";
// import "./App.css";
//source in spotify api framework
import Spotify from "spotify-web-api-js";
//define class of new Spotify into spotifyWebApi
const spotifyWebApi = new Spotify();

class RandomSong extends Component {
  goToAfterLogIn = () => {
    this.props.history.push("/");
  };
  //reruns nowPlaying and forces an update every 20 seconds to keep current song displaying
  componentDidMount() {
    setInterval(() => {
      this.getNowPlaying();
      this.forceUpdate();
      console.log("force rerender");
    }, 20000);
  }
  //saving in constructor, required for spotify api use
  constructor() {
    super();
    //saves getHashParams in params varable
    const params = this.getHashParams();
    //default state
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: "Not Checked",
        artist: "",
        album: "",
        image:
          "https://image.shutterstock.com/image-vector/music-note-icon-vector-260nw-415866139.jpg",
      },
      randomSong: {
        artist: "artist",
        album: "album",
        song: "song",
        image:
          "https://image.shutterstock.com/image-vector/music-note-icon-vector-260nw-415866139.jpg",
        id: "id",
      },
      relatedArtists: {
        artists: [],
      },
    };
    //if no access token exists, refresh token
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }
  //generates new token
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  //function to generate random queue
  getRandomSearch = () => {
    // A list of all characters that can be chosen.
    const characters = "abcdefghijklmnopqrstuvwxyz";

    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    let randomSearch = "";

    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + "%";
        break;
      case 1:
        randomSearch = "%" + randomCharacter + "%";
        break;
    }

    return randomSearch;
  };
  //function to call random song
  randomSong() {
    //list of all valid country codes that spotify utilizes. Needs to be randomized or spotify will always
    //use users default country code and result won't truly be random
    let countries = [
      "AD",
      "AR",
      "AU",
      "AT",
      "BE",
      "BO",
      "BR",
      "BG",
      "CL",
      "CO",
      "CR",
      "CY",
      "CZ",
      "DK",
      "DO",
      "EC",
      "SV",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "GT",
      "HN",
      "HK",
      "HU",
      "IS",
      "IE",
      "IT",
      "LV",
      "LI",
      "LT",
      "LU",
      "MY",
      "MT",
      "MX",
      "MC",
      "NL",
      "NZ",
      "NI",
      "NO",
      "PA",
      "PY",
      "PE",
      "PH",
      "PL",
      "PT",
      "SG",
      "SK",
      "ES",
      "SE",
      "CH",
      "TW",
      "TR",
      "GB",
      "UY",
      "US",
    ];
    //sets random offset number, this picks a random page of the up to 2000 pages that spotify allows
    const randomOffset = Math.floor(Math.random() * 2000);
    //selects random index of 50 items listed on each page.
    const randomIndex = Math.floor(Math.random() * 50);
    //selects random country code from array
    const randomCountry = Math.floor(Math.random() * countries.length);
    //generate search query with random search parameters
    spotifyWebApi
      .searchTracks(this.getRandomSearch(), {
        limit: 50,
        offset: randomOffset,
        market: countries[randomCountry],
      })
      .then((response) => {
        console.log(
          "randomSong",
          response.tracks.items[randomIndex].external_urls.spotify
        );
        this.setState({
          randomSong: {
            artist: response.tracks.items[randomIndex].artists[0].name, //artist
            album: response.tracks.items[randomIndex].album.name, //album
            song: response.tracks.items[randomIndex].name, //song
            image: response.tracks.items[randomIndex].album.images[0].url, //album artwork
            id: response.tracks.items[randomIndex].artists[0].id, //artist id used for similar artists
            open: response.tracks.items[randomIndex].external_urls.spotify, //generates an open link for that track
          },
        });
        //calls related artists function when randomSong is run
        this.getRelatedArtists();
        //recalls NowPlaying when randomSong is called
        this.getNowPlaying();
      })
      .catch((error) => {
        console.log("song not found, rerunning");
        //if 404, rerun function
        this.randomSong();
      });
  }
  //generates similar artists to the artist of the random song
  getRelatedArtists() {
    //spotify web api request for getting related artists, plugs in artist id from randomSong function
    spotifyWebApi
      .getArtistRelatedArtists(this.state.randomSong.id)
      .then((response) => {
        //empty array
        let artistsArray = [];
        //...loop through response
        for (let i = 0; i < response.artists.length; i++) {
          const element = response.artists[i];
          //...push response to array
          artistsArray.push(element.name);
        }
        //...set state with array information
        this.setState({
          relatedArtists: {
            artists: artistsArray,
          },
        });
      });
  }
  //grabs playback info from logged in user.
  getNowPlaying() {
    //web api function used for playback
    spotifyWebApi.getMyCurrentPlaybackState().then((response) => {
      console.log("getNowPlaying", response);
      //if response is undefined, return. Gaurds against errors if nothing is playing.
      if (!response) {
        return;
      }
      //set state with response
      this.setState({
        nowPlaying: {
          name: response.item.name,
          artist: response.item.artists[0].name,
          album: response.item.album.name,
          image: response.item.album.images[0].url,
        },
      });
    });
  }
  render() {
    //grabs artists info from getRelatedArtists, saves to varable.
    const { artists } = this.state.relatedArtists;
    return (
      <div className="App">
        <h1>RANDOM SONG</h1>
        {/* button to log in with spotify, takes you to spotify web api server used for log in */}
        <a href="http://localhost:8888">
          <button>Login With Spotify</button>
        </a>
        {/* populates with current playing info */}
        <div>
          Now Playing:{" "}
          <ul>
            <li>Track: {this.state.nowPlaying.name}</li>
            <li>Artist: {this.state.nowPlaying.artist}</li>
            <li>Album: {this.state.nowPlaying.album}</li>
          </ul>
        </div>
        <div>
          <img
            src={this.state.nowPlaying.image}
            alt="album art"
            style={{ width: 100 }}
          />
        </div>
        {/* generates random song */}
        <button onClick={() => this.randomSong()}>Generate Random Song</button>
        <div>Artist: {this.state.randomSong.artist}</div>
        <div>Album: {this.state.randomSong.album}</div>
        <div>Track: {this.state.randomSong.song}</div>
        <div>
          <img
            src={this.state.randomSong.image}
            alt="album art"
            style={{ width: 100 }}
          />
        </div>
        {/* takes open log, places it in href, can open random song in spotify */}
        <a href={this.state.randomSong.open} target="_blank">
          <button>Open this song in spotify</button>
        </a>
        {/* gives a list of artists that are similar to randomly generated one. */}
        <ul>
          Similar Artists:
          {artists.map((artist, index) => {
            return <li key={index}>{artist}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default RandomSong;
