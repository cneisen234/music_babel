import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper } from "@material-ui/core";
//source in spotify api framework
import Spotify from "spotify-web-api-js";
import { nominalTypeHack } from "prop-types";
//define class of new Spotify into spotifyWebApi
const spotifyWebApi = new Spotify();

// Header is a controlled component that renders the header of the site
class Header extends Component {
  //local state for toggle and user inputs at login and registeration
  state = {
    toggle: false,
    username: "",
    password: "",
    background: "",
    nowPlaying: {
      name: "",
      artist: "",
      album: "",
      image:
        "https://image.shutterstock.com/image-vector/music-note-icon-vector-260nw-415866139.jpg",
    },
  };
  componentDidMount() {
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
  //function that registers user
  registerUser = (event) => {
    //prevent default action of browser
    event.preventDefault();

    if (this.state.username && this.state.password) {
      //sends local state to redux
      this.props.dispatch({
        type: "REGISTER",
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
      this.toggle();
    } else {
      //failed registeration
      this.props.dispatch({ type: "REGISTRATION_INPUT_ERROR" });
    }
  }; // end registerUser

  login = (event) => {
    //prevent default action of browser
    event.preventDefault();
    //allow login only if username and password match
    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: "LOGIN",
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      //error at login
      this.props.dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  };
  //sets input values to local state
  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };
  //toggles a true or false value when run, used to conditionally render
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };
  // React render function
  render() {
    return (
      <div className="App" className={this.state.background}>
        <header className="App-header">
          <Paper
            style={{
              right: 0,
              top: 0,
              position: "fixed",
              borderRadius: "10%",
              height: "250px",
              width: "400px",
              fontSize: "15px",
            }}
            elevation="24"
            className="loginBox"
          >
            {" "}
            {/* user currently signed in */}
            <p>Hello: {this.props.user.username}</p>
            {/* populates with current playing info */}
              <div
                style={{
                  textAlign: "center",
                }}
              >
                Now Playing:{" "}
              </div>
              <table>
                  <tr>
                      <td>
              <ul
                style={{
                  float: "left",
                  listStyle: "none",
                }}
              >
                <li>Track: {this.state.nowPlaying.name}</li>
                <li>Artist: {this.state.nowPlaying.artist}</li>
                <li>Album: {this.state.nowPlaying.album}</li>
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
          </Paper>
          <h1 className="App-title">Music Babel</h1>
          <h3 className="App-title">You're place for music community</h3>
          {/* if toggle is false show the login page */}
          {this.state.toggle === false ? (
            <>
              <h4 className="App-title">Login:</h4>
              {/* login form */}
              <form onSubmit={this.login}>
                <TextField
                  className="input"
                  type="text"
                  required
                  placeholder="username"
                  label="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChangeFor("username")}
                />
                <TextField
                  className="input"
                  type="password"
                  required
                  placeholder="password"
                  label="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChangeFor("password")}
                />
                <br />
                <Button
                  className="log-in"
                  type="submit"
                  name="submit"
                  variant="contained"
                  color="secondary"
                >
                  Log in
                </Button>
              </form>
              {/* uses toggle() to switch between login and registeration */}
              <Button
                variant="contained"
                color="secondary"
                onClick={this.toggle}
              >
                Create New Account
              </Button>
              {/* logout */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.props.dispatch({ type: "LOGOUT" })}
              >
                Log out
              </Button>
            </>
          ) : (
            // if toggle is true, load registeration page
            <>
              {/* registeration form */}
              <form onSubmit={this.registerUser}>
                <h4 className="App-title">Sign up:</h4>
                <TextField
                  className="input"
                  type="text"
                  required
                  placeholder="username"
                  label="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChangeFor("username")}
                />
                <br />
                <TextField
                  className="input"
                  type="password"
                  required
                  placeholder="password"
                  label="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChangeFor("password")}
                />
                <br />
                <TextField
                  type="text"
                  placeholder="profile pic"
                  label="profile pic"
                  name="profile pic"
                  className="input"
                />
                <br />
                <Button
                  className="register"
                  type="submit"
                  name="submit"
                  variant="contained"
                  color="secondary"
                >
                  Register
                </Button>
              </form>
              {/* changes toggle() back to false thus loading the signin page */}
              <Button
                variant="contained"
                color="secondary"
                onClick={this.toggle}
              >
                go back to login
              </Button>
            </>
          )}
        </header>
        <br />
      </div>
    );
  }
}
// redux state
const mapStateToProps = (state) => ({
  errors: state.errors,
  user: state.user,
});

export default connect(mapStateToProps)(Header);