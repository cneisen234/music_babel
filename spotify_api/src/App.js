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
const spotifyWebApi = new Spotify();

//main App component, this acts as the parent for all components on page
class App extends Component {
  state = {
    toggle: false,
    toggle2: false,
    nowPlaying: {
      name: "",
      artist: "",
      album: "",
      image:
        "https://image.shutterstock.com/image-vector/music-note-icon-vector-260nw-415866139.jpg",
    },
  }
  componentDidMount() {
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
    }, 20000);
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
          name: response.item.name,
          artist: response.item.artists[0].name,
          album: response.item.album.name,
          image: response.item.album.images[0].url,
        },
      });
    });
  }

  logout = () => {
    swal({
      title: "Confirm logout?",
      text: "Click ok to confirm logout",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willLogout) => {
        if (willLogout) {
          this.props.dispatch({ type: "LOGOUT" })
          swal("Logout successful", {
            icon: "success",
          });
        } else {
          swal("Logout canceled");
        }
      });
  }
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };
  toggle2 = () => {
    this.setState({
      toggle2: !this.state.toggle2,
    });
  };
  
  render() {
 
  return (
    <div className="App">
      {this.props.user.username ? (
        <>
          {this.state.toggle2 === false ? (
            <Paper
              style={{
                right: 0,
                top: 0,
                position: "fixed",
                borderRadius: "10%",
                height: "400px",
                width: "400px",
                fontSize: "15px",
                zIndex: 10000,
              }}
              elevation="24"
              className="loginBox"
            >
              {" "}
              {/* user currently signed in */}
              <p>Hello: {this.props.user.username}</p>
              {/* populates with current playing info */}
              <table>
                <tr>
                  <td>
                    <ul
                      style={{
                        float: "left",
                        listStyle: "none",
                      }}
                    >
                      <li>
                        <b>Track:</b> {this.state.nowPlaying.name}
                      </li>
                      <li>
                        <b>Artist:</b> {this.state.nowPlaying.artist}
                      </li>
                      <li>
                        <b>Album:</b> {this.state.nowPlaying.album}
                      </li>
                    </ul>
                  </td>
                  <td>
                    <div>
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
              <br />
              {/* button to log in with spotify, takes you to spotify web api server used for log in */}
              <a href="http://localhost:8888">
                <Button variant="contained" color="secondary">
                  Link to Spotify
                </Button>
              </a>
              {/* logout */}
              <Button
                variant="contained"
                color="secondary"
                onClick={this.logout}
              >
                Log out
              </Button>

              <br />
              <Button
                variant="contained"
                color="secondary"
                onClick={this.toggle2}
              >
                toggle window
              </Button>
            </Paper>
          ) : (
              <Paper
                style={{
                  right: 0,
                  top: 0,
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
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.toggle2}
                >
                  toggle window
              </Button>
              </Paper>
            )}
        </>
      ) : (
          <span></span>
        )}
      <Header /> {/*Header page which includes login */}
      <Grid container spacing={1}>
        <Grid container item md={12} lg={6}>
      <Button
        onClick={this.toggle}
        className="feedbackButton"
        variant="contained"
        color="primary"
        type="submit"
      >
        <h1>Recommendations</h1>
            </Button>
            {this.state.toggle === false ? (
              <span></span>
            ) : (
      <Recommendations /> 
              
        )} {/*Recommendations page */}
        </Grid>
        <Grid container item md={12} lg={6}>
      <RandomSong /> {/*RandomSong page */}
      </Grid>
    </Grid>
    </div>
  );
  }
}
const mapStateToProps = (state) => ({
  errors: state.errors,
  user: state.user,
});
export default connect(mapStateToProps)(App);
