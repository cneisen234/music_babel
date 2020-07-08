import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper, Select, MenuItem, Grid } from "@material-ui/core";
import MusicItem from "../musicitem/musicitem"
import swal from "sweetalert";
import axios from "axios";

class Recommendations extends Component {
  state = {
      id: null,
      username: "",
      song: "",
      artist: "",
      album: "",
      rate: null,
  }
  //fetches music list from database on mount
  componentDidMount() {
    this.props.dispatch({ type: "FETCH_MUSIC" });
  }
  //function to toggle
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };
  //function to handle unput changes
  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value }); //sets to value of targeted event
  }; //end handleChange
  //function to POST a recommendation
  addNewRecommendation = (event) => {
    //prevents default action
    event.preventDefault();
    
    //grabs all keys in Redux state
    const { username } = this.props.user;
    //grabs keys in local state
    const { song, artist, album } = this.state 
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
        axios({ //start axios
          method: "POST",
          url: "/music",
          data: {
            username: username,
            song: song,
            artist: artist,
            album: album,
          }
       //data from local state to POST
        }) //end axios
          .then((response) => {// start .then
            this.props.dispatch({ type: "FETCH_MUSIC" });
          }) //end .then
          .catch((error) => { //start .catchError
            console.log(error);
          }); //end .catchError
        //success! Info POSTED to database
        swal("Thank you for your recommendation!", {
          icon: "success",
        });
        //...else canceled
      } else {
        swal("Your recommendations submission was canceled!");
      }
    })
    //reset local state
    this.setState ({
      song: "",
      artist: "",
      album: "",
    })
  };

  
  // React render function
  render() {
    return (
      <div className="App">
        {/* start form for POST of a new recommendation */}
        {!this.props.user.username ? ( 
          //if user is not logged in, render no inputs
        <span></span>
        ) : (
          //is the user logged in? If so, render
        <form onSubmit={this.addNewRecommendation}>
              <Grid container spacing={1}>
                <Grid container item md={12} lg={4}>
          {/* song */}
          <TextField
            variant="outlined"
            required
            label="Song"
            name="Song"
            // sets value of input to local state
            value={this.state.song}
            type="text"
            maxLength={1000}
            onChange={(event) => this.handleChange(event, "song")} //onChange of input values set local state
          /><br />
          </Grid>
                <Grid container item md={12} lg={4}>
          {/* artist */}
          <TextField
            variant="outlined"
            required
            label="Artist"
            name="Artist"
            // sets value of input to local state
            value={this.state.artist}
            type="text"
            maxLength={1000}
            onChange={(event) => this.handleChange(event, "artist")} //onChange of input values set local state
          /><br />
          </Grid>
                <Grid container item md={12} lg={4}>
          {/* album */}
          <TextField
            variant="outlined"
            required
            label="Album"
            name="Album"
            // sets value of input to local state
            value={this.state.album}
            type="text"
            maxLength={1000}
            onChange={(event) => this.handleChange(event, "album")} //onChange of input values set local state
          />
          </Grid>
          </Grid>
              {/* onClick tied to form element, runs addNewRecommendation on click */}
              <Grid container spacing={1}>
            <Grid container item md={12}>
          <button
            type="submit"
          >
            Add recommendation
            </button>
            </Grid>
            </Grid>
        </form>
        )}
        <div>
              {/* map through entire data query */}
              {this.props.music.map((musicitem) => {
                // create MusicItem component for each mapped item, pass musicitem in as props, this gives us access to everything
                // for each mapped item within it's designated component
                return <MusicItem key={musicitem.id} musicitem={musicitem} />;
              })}
        </div>
      </div>
    ); //end return
  } //end render
} //end Recommendations
//redux state
const mapStateToProps = (state) => ({
  errors: state.errors,
  music: state.music,
  user: state.user,
});
export default connect(mapStateToProps)(Recommendations);