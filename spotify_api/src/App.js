import React, { Component } from 'react';
import './App.css';
//source in spotify api framework
import Spotify from "spotify-web-api-js";
import swal from "sweetalert";
import { TextField, Button, Paper, Select, MenuItem, Grid } from "@material-ui/core";
//define class of new Spotify into spotifyWebApi
import RandomSong from "./random-song/random-song"
import Recommendations from "./recommendations/recommendations"
import { connect } from 'react-redux';
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
const spotifyWebApi = new Spotify();

//main App component, this acts as the parent for all components on page
class App extends Component {
  constructor() {
    super();
    //saves getHashParams in params varable
    const params = this.getHashParams();
  this.state = {
    toggle: false,
    toggle2: false,
    //state that houses current playing values grabbed from spotify
    loggedIn: params.access_token ? true : false,
    nowPlaying: {
      song: "",
      artist: "",
      album: "",
      image:
        "https://image.shutterstock.com/image-vector/music-note-icon-vector-260nw-415866139.jpg",
    },
  }
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
  componentDidMount() {
    //fetches user info on mount from login info, ensures we don't lose user info on refresh
    this.props.dispatch({ type: 'FETCH_USER' })
    //calls getNowPlaying on mount
    this.getNowPlaying();
    //selected a random photo class
    const randomPhoto = "photo" + Math.floor(Math.random() * 11);
    this.setState({
      background: randomPhoto,
    });
    //reruns nowPlaying and forces an update every 20 seconds to keep current song displaying
    setInterval(() => {
      this.getNowPlaying();
      this.forceUpdate();
      console.log("force rerender");
    }, 10000);
  }
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
          song: response.item.name,
          artist: response.item.artists[0].name,
          album: response.item.album.name,
          image: response.item.album.images[0].url,
        },
      });
    });
  }
  //function for logout
  logout = () => {
    //sweet alerts!
    swal({
      title: "Confirm logout?",
      text: "Click ok to confirm logout",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willLogout) => {
        if (willLogout) {
          //runs logout from redux sagas
          this.props.dispatch({ type: "LOGOUT" })
          //success!
          swal("Logout successful", {
            icon: "success",
          });
        } else {
          //...else cancel
          swal("Logout canceled");
        }
      });
  }
  addCurrentToRecommendation = (event) => {
    //prevents default action
    event.preventDefault();

    //grabs all keys in Redux state
    const { username, profile_pic } = this.props.user;
    //grabs keys in local state
    const { song, artist, album } = this.state.nowPlaying
    //sweet alerts
    swal({
      //confirmation page exists in sweet alerts notification
      title: "Confirm your recommendation",
      text: `${this.props.user.username}'s recommendation
        Song: ${song}
        Artist: ${artist}
        Album: ${album}
        click "ok" to confirm`,
      icon: "info",
      buttons: true,
      dangerMode: true,
      //end sweet alerts
    }).then((confirm) => {//start .then
      if (confirm) {
        this.props.dispatch({
          type: 'ADD_MUSIC', payload: {
            username: username,
            profile_pic: profile_pic,
            song: song,
            artist: artist,
            album: album,
          }
        })
        //success! Info POSTED to database
        swal("Thank you for your recommendation!", {
          icon: "success",
        });
        //...else canceled
      } else {
        swal("Your recommendations submission was canceled!");
      }
    })
  };
  //toggle
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };
  //toggle2
  toggle2 = () => {
    this.setState({
      toggle2: !this.state.toggle2,
    });
  };
  
  render() {
 
  return (
    <div className="App">
      {/* is the user logged in? */}
      {this.props.user.username ? (
        <>
          {/* if toggle2 is false render the nowPlaying window, this is default */}
          {this.state.toggle2 === false ? (
            <Paper
              style={{
                right: 0,
                top: 0,
                position: "fixed",
                borderRadius: "10%",
                height: "500px",
                width: "350px",
                fontSize: "15px",
                zIndex: 10000,
              }}
              elevation="24"
              className="loginBox"
            >
              
              {/* populates with current playing info */}
              <table>
                <tr>
                  <td>
                    {/* pushes song, artist, and album to the left of window */}
                    <ul
                      style={{
                        float: "left",
                        listStyle: "none",
                      }}
                    >
                      <li>
                        {/* current track */}
                        <b>Track:</b> {this.state.nowPlaying.song}
                      </li>
                      <li>
                        {/* current artist */}
                        <b>Artist:</b> {this.state.nowPlaying.artist}
                      </li>
                      <li>
                        {/* current album */}
                        <b>Album:</b> {this.state.nowPlaying.album}
                      </li>
                    </ul>
                  </td>
                  <td>
                    <div>
                      {/* pushes album artwork to right */}
                      <img
                        style={{
                          float: "right",
                        }}
                        src={this.state.nowPlaying.image}
                        alt="album art"
                        style={{ width: 100 }}
                      />
                    </div>
                  </td>
                </tr>
              </table>
              {/* button to log in with spotify, takes you to spotify web api server used for log in */}
              <br /><a href="http://localhost:8888">
                <button variant="contained" color="secondary">
                  Link to Spotify
                </button>
              </a>
              {/* logout */}
              <button
                variant="contained"
                color="secondary"
                onClick={this.logout}
              >
                Log out
              </button>
              {this.state.nowPlaying.song === "" ? (
                <span></span>
              ) : (
                // will add current listening song to recommendations list
                <>
                <br />
              <button
                variant="contained"
                color="secondary"
                onClick={this.addCurrentToRecommendation}
              >
                Recommend this song?
              </button></>
              )}

              <br />
              {/* toggles window to make it appear or disappear */}
              <button
                variant="contained"
                color="secondary"
                onClick={this.toggle2}
              >
                toggle window
              </button>
            </Paper>
          ) : (
            // ...else shrinks window and only shows button to toggle back.
              <Paper
                style={{
                  right: 0,
                  bottom: 50,
                  position: "fixed",
                  borderRadius: "10%",
                  height: "50px",
                  width: "150px",
                  fontSize: "15px",
                  zIndex: 10000,
                }}
                elevation="24"
                className="loginBox"
              >
                {" "}
                <button
                  variant="contained"
                  color="secondary"
                  onClick={this.toggle2}
                >
                  toggle window
              </button>
              </Paper>
            )}
        </>
      ) : (
        //...else if user is not logged in, render nothing
          <span></span>
        )}
      <Header/> {/*Header page which includes login */}
      {/* grid layout for mobile friendly, fits screensize */}
      <Grid container spacing={1} style={{display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",}}>
        {this.state.toggle === false ? (
          <>
          <br />
          <button onClick={this.toggle}>Go to Random Song</button><br />
        <Grid container item md={12}>
      <Recommendations /> {/*...end Recommendations page */}
        </Grid>
        </>
        ) : (
          <>
        {!this.props.user.username ? (
          //can only generate a random song if logged in
          <>
          <br />
                <button onClick={this.toggle}>Go to Recommendations</button><br />
          <p>Please log in and link to your spotify in order to use this feature</p>
          </>
        ) : (
          <>
          <br />
                  <button onClick={this.toggle}>Go to Recommendations</button><br />
        <Grid container item md={12}>
                      <RandomSong/> {/*RandomSong page */}
      </Grid>
      </>
        )}
        </>
        )}
    </Grid>
    <Footer />
    </div>
  ); //end return
  } //end render
}//end App
//redux state
const mapStateToProps = (state) => ({
  errors: state.errors,
  user: state.user,
});
export default connect(mapStateToProps)(App);
