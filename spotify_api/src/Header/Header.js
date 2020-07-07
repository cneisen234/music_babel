import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper } from "@material-ui/core";
//source in spotify api framework
import Spotify from "spotify-web-api-js";
import swal from "sweetalert";
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
  };
  componentDidMount() {
    //selected a random photo class
    const randomPhoto = "photo" + Math.floor(Math.random() * 11);
    this.setState({
      background: randomPhoto,
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
      //toggles back to login when registered
      this.toggle();
      swal(`welcome ${this.state.username} to Music Babel! 
      Enjoy!`, {
        icon: "success",
      })
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
      this.setState({
        username: "",
        password: "",
      })
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
  //function to log user out
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
          this.props.dispatch({ type: "LOGOUT" })  
          swal("Logout successful", {
            icon: "success",
          });
        } else {
          swal("Logout canceled");
        }
      });
  }
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
          {/* Title headers that appear at top of page */}
          <h1 className="App-title">Music Babel</h1>
          <h3 className="App-title">Your place for music community</h3>
          {/* button to log in with spotify, takes you to spotify web api server used for log in */}
          {this.props.user.username ? (
            <>
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
              </>
          ) : (
            <>
          {/* if toggle is false show the login page */}
          {this.state.toggle === false ? (
            <>
              <h4 className="App-title">Login:</h4>
              {/* login form */}
              <form onSubmit={this.login}>
                {/* username */}
                      <Paper style={{
                        height: "5%",
                        width: "100%",
                        borderRadius: 20,
                      }} elevation="24"><TextField
                  className="input"
                  type="text"
                  required
                  placeholder="username"
                  label="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChangeFor("username")}
                />
                {/* password */}
                <TextField
                  className="input"
                  type="password"
                  required
                  placeholder="password"
                  label="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChangeFor("password")}
                /></Paper>
                <br />
                {/* login */}
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
        
            </>
          ) : (
            // if toggle is true, load registeration page
            <>
              {/* registeration form */}
              <form onSubmit={this.registerUser}>
                <h4 className="App-title">Sign up:</h4>
                {/* username */}
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
                {/* password */}
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
                {/* profile pic */}
                <TextField
                  type="text"
                  placeholder="profile pic"
                  label="profile pic"
                  name="profile pic"
                  className="input"
                />
                <br />
                {/* register */}
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
