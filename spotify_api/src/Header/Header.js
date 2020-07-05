import React, { Component } from "react";
import { connect } from "react-redux";

// Header is a controlled component that renders the header of the site
class Header extends Component {
    //local state for toggle and user inputs at login and registeration
  state = {
    toggle: false,
    username: "",
    password: "",
  };

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
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Header</h1>
          {/* user currently signed in */}
          <p>currently logged in as: {this.props.user.username}</p>
          {/* if toggle is false show the login page */}
          {this.state.toggle === false ? (
            <>
              <h4>Login:</h4>
              {/* login form */}
              <form onSubmit={this.login}>
                <input
                  type="text"
                  required
                  placeholder="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChangeFor("username")}
                ></input>
                <br />
                <input
                  type="password"
                  required
                  placeholder="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChangeFor("password")}
                ></input>
                <br />
                <input
                  className="log-in"
                  type="submit"
                  name="submit"
                  value="Log In"
                />
              </form>
              {/* uses toggle() to switch between login and registeration */}
              <button onClick={this.toggle}>New user? Sign up here</button>
              {/* logout */}
              <button
                onClick={() => this.props.dispatch({ type: "LOGOUT" })}
              >Log out</button>
            </>
          ) : (
            // if toggle is true, load registeration page
            <>
              {/* registeration form */}
              <form onSubmit={this.registerUser}>
                <h4>Sign up:</h4>
                <input
                  type="text"
                  required
                  placeholder="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChangeFor("username")}
                ></input>
                <br />
                <input
                  type="password"
                  required
                  placeholder="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChangeFor("password")}
                ></input>
                <br />
                <input type="text" placeholder="profile pic"></input>
                <br />
                <input
                  className="register"
                  type="submit"
                  name="submit"
                  value="Register"
                />
              </form>
              {/* changes toggle() back to false thus loading the signin page */}
              <button onClick={this.toggle}>go back to login</button>
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
