import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper } from "@material-ui/core";
import swal from "sweetalert";
import axios from "axios";

class MusicItem extends Component {
  state = {
    username: "",
    song: "",
    artist: "",
    album: "",
    toggle: false,
  }
  //refreshes database info on load
  componentDidMount() {
  
  }
  //deletes selected review
  deleteMusic = (event) => {
    event.preventDefault();
    //sweet alerts!
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this recommendation!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      //end sweet alerts
    }).then((willDelete) => {
      // start .then
      //if confirmed, delete
          if(willDelete) {
            console.log("this.props.musicitem.id", this.props.musicitem.id)
            axios({
              method: "DELETE",
              url: `/music/${this.props.musicitem.id}`,
              //grabs id of component that are interacting with
        })
        .then(function (response) {});
        //success! review deleted
        swal("Poof! Your recommendation has been deleted!", {
          icon: "success",
        });
      } else {
        //...else cancel action
        swal("Your recommendation is safe!");
      }
      //reloads page after 1.5 seconds of deletion to reflect update on recommendations page
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);
    });
  }; //end deleteReview

  //flags the current review with a PUT request
  editReview = (event) => {
    //prevents default action
    event.preventDefault();
    //sweet alerts
    const { username } = this.props.user;
    const { song, artist, album } = this.state 
    swal({
      title: "Save changes?",
      text: `${ this.props.user.username }'s recommendation:
      review changes to entry below
        Song: ${ song }
        Artist: ${ artist }
        Album: ${ album }
        click "ok" to confirm`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      //end sweet alerts
    }).then((confirm) => {
      if (confirm) {
        axios({
          //start axios
          method: "PUT",
          url: `/music/${this.props.musicitem.id}`,
          data: {
            username: username,
            song: song,
            artist: artist,
            album: album,
          },
        }) //end axios
          .then((response) => {
            //start .then
          }) //end .then
          .catch((error) => {
            //start .catchError
            console.log(error);
          }); //end .catchError
        //success! Review flagged
        swal("Your changes have been saved!", {
          icon: "success",
        });
      } else {
        //...else cancel
        swal("No changes were made!");
      }
      //reloads page showing current info from database with newly flagged item
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  };

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value }); //sets to value of targeted event
  }; //end handleChange
  
  toggle = () => {
    const { musicitem } = this.props;
    this.setState({
      song: musicitem.song,
      artist: musicitem.artist,
      album: musicitem.album,
      toggle: !this.state.toggle,
    });
  };
  render() {
    // grabs admin parem from map of parent
    const { musicitem } = this.props;
    return (
      // displays list of recommended songs from database
      <tr>
        {/* table data for each mapped item */}
        <td>{musicitem.username}</td>
        <td>{musicitem.song}</td>
        <td>{musicitem.artist}</td>
        <td>{musicitem.album}</td>
       {this.props.user.username === musicitem.username ? (
                  <>
        <td> <Button
          onClick={this.deleteMusic}
          className="feedbackButton"
          variant="contained"
          color="secondary"
          type="delete"
        >
          Delete
                </Button></td>
        <td><Button
          onClick={this.toggle}
          className="feedbackButton"
          variant="contained"
          color="secondary"
          type="delete"
        >
          Edit
                </Button></td>
                </>
       ) : (
         <span></span>
)}

                {this.state.toggle === false ? (
                  <span></span>
                ) : (
            <Paper
              style={{
                right: 0,
                bottom: 0,
                position: "fixed",
                borderRadius: "10%",
                height: "400px",
                width: "400px",
                fontSize: "15px",
              }}
              elevation="24"
              className="loginBox"
            ><td> <form onSubmit={this.editReview}>
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
          />
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
          />
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
            className="recommendationButton"
            variant="contained"
            color="secondary"
            type="submit"
          >
            Edit recommendation
            </Button>
        </form>
                <Button
                  onClick={this.toggle}
                  className="recommendationButton"
                  variant="contained"
                  color="secondary"
                  type="submit"
                >
                  Go Back
            </Button></td></Paper>
                )}

        {/* clickable event, runs flagForReview function */}
        {/* formats timestamp with moment */}
        {/* <td>{moment(admin.date).format("MMMM Do YYYY")}</td>
        <td> */}
          {
            //delete button, runs deleteReview function on click
            // <Button
            //   onClick={this.deleteReview}
            //   className="feedbackButton"
            //   variant="contained"
            //   color="secondary"
            //   type="delete"
            // >
            //   Delete
            // </Button>
          }
        {/* </td> */}
      </tr>
    ); // end return
  } // end render
} // end class Footer
// pull props from Redux state
// redux state
const mapStateToProps = (state) => ({
  errors: state.errors,
  user: state.user,
});

export default connect(mapStateToProps)(MusicItem);
