import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper, Select, MenuItem, Grid } from "@material-ui/core";
import MusicItem from "../musicitem/musicitem"
import swal from "sweetalert";
import axios from "axios";

class Recommendations extends Component {
  //local state
  state = {
      id: null,
      username: "",
      song: "",
      artist: "",
      album: "",
      rate: null,
      start: 0,
      finish: 5,
      toggle: false,
      search: "",
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
      //runs axios request in sagas
        this.props.dispatch({
          type: 'ADD_MUSIC', payload: {
            username: username,
            song: song,
            artist: artist,
            album: album,
          }})
        //success! Info POSTED to database
        swal("Thank you for your recommendation!", {
          icon: "success",
        })
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

  search = (event) => {
    //prevents default action
    event.preventDefault();
    //grabs keys in local state
    const { search } = this.state
    //runs axios request in sagas
        this.props.dispatch({
          type: 'POST_SEARCH', payload: {
            search: search
          }
        })
    //reset local state
    this.setState({
      search: ""
    })
  };
  //sets state of start and finish to +5 to generate next 5 items
  next = () => {
    this.setState({
      start: this.state.start + 5,
      finish: this.state.finish + 5,
    })
  }
   //sets state of start and finish to -5 to generate previous 5 items
  previous = () => {
    this.setState({
      start: this.state.start - 5,
      finish: this.state.finish - 5,
    })
  }

  
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
          <>
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
        {/* onClick search from display view to search view */}
        </>
        )}
        <div>
              {/* map through entire data query */}
              {this.state.toggle === false ? (
                <>
              <button onClick={this.toggle}>Search</button>
              {this.props.music.map((musicitem, index) => {
                // create MusicItem component for each mapped item, pass musicitem in as props, this gives us access to everything
                // for each mapped item within it's designated component
                // also only renders items that are inbetween the index of start and finish in state
                if (index > this.state.start && index <= this.state.finish) {
                return <MusicItem key={musicitem.id} musicitem={musicitem} />;
                }
              })}
              {/* if there are no previous items, make previous button disappear */}
              {this.state.start !== 0 && <button onClick={this.previous}>previous</button>}
              {/* if there are no next items, make next button disappear */}
              {(this.state.start > this.props.music.length - 7) ? (
                <span></span> 
              ) : (
                <button onClick={this.next}>Next</button>
              )}
              </>
              ) : (
              <>
              {/* search box */}
                <TextField
                  variant="outlined"
                  required
                  label="Search"
                  name="Search"
                  // sets value of input to local state
                  value={this.state.search}
                  type="text"
                  maxLength={1000}
                  onChange={(event) => this.handleChange(event, "search")} //onChange of input values set local state
                /><button onClick={this.search}>Search</button>
                <button onClick={this.toggle}>Go Back</button>
                {this.props.search.map((musicitem, index) => {
                  // create MusicItem component for each mapped item, pass musicitem in as props, this gives us access to everything
                  // for each mapped item within it's designated component
                    return <MusicItem key={musicitem.id} musicitem={musicitem} />;
                })}
              </>
              )}
        </div>
      </div>
    ); //end return
  } //end render
} //end Recommendations
//redux state
const mapStateToProps = (state) => ({
  errors: state.errors,
  music: state.music,
  search: state.search,
  user: state.user,
});
export default connect(mapStateToProps)(Recommendations);