import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper, Select, MenuItem } from "@material-ui/core";
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
  componentDidMount() {
    this.props.dispatch({ type: "FETCH_MUSIC" });
  }
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };
  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value }); //sets to value of targeted event
  }; //end handleChange
  addNewRecommendation = (event) => {
    event.preventDefault();
    
    //grabs all keys in Redux state
    const { username } = this.props.user;
    const { song, artist, album } = this.state 
    console.log("song, artist, album", song, artist, album)
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
       //data from Redux state to POST
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
        {/* onSubmit run submitInfo function */}
        {!this.props.user.username ? ( 
        <span></span>
        ) : (
        <form onSubmit={this.addNewRecommendation}>
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
          <br />
          {/* onClick tied to form element, runs submitInfo on click */}
          <Button
            className="feedbackButton"
            variant="contained"
            color="secondary"
            type="submit"
          >
            Add recommendation
            </Button>
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