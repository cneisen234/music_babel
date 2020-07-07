import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper, Select, MenuItem } from "@material-ui/core";
import swal from "sweetalert";
import axios from "axios";

class MusicItem extends Component {
  state = {
    id: null,
    username: "",
    song: "",
    artist: "",
    album: "",
    toggle: false,
    toggle2: false,
    rate: null
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
  rate = (event) => {
    event.preventDefault();

    //grabs all keys in Redux state
    const { id, song } = this.props.musicitem;
    const { rate } = this.state
    //sweet alerts
    swal({
      //confirmation page exists in sweet alerts notification
      title: "Confirm your recommendation",
      text: `Give ${song} a rating of ${rate}?
        click "ok" to confirm`,
      icon: "info",
      buttons: true,
      dangerMode: true,
      //end sweet alerts
    }).then((confirm) => {//start .then
      if (confirm) {
        axios({ //start axios
          method: "POST",
          url: "/music/rate",
          data: {
            id: id[0],
            rate: rate,
          }
          //data from Redux state to POST
        }) //end axios
          .then((response) => {// start .then
            this.toggle2();
            this.props.dispatch({ type: "FETCH_MUSIC" });
          }) //end .then
          .catch((error) => { //start .catchError
            console.log(error);
          }); //end .catchError
        //success! Info POSTED to database
        swal("Thank you for your rating!", {
          icon: "success",
        });
        //...else canceled
      } else {
        swal("Your rating submission was canceled!");
      }
    })
    this.setState({
    rate: null
    })
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
  toggle2 = () => {
    this.setState({
      toggle2: !this.state.toggle2,
    });
  };
  render() {
    // grabs admin parem from map of parent
    const { musicitem } = this.props;
    const { rate } = this.props.musicitem
    return (
      // displays list of recommended songs from database
      <tr>
        {/* table data for each mapped item */}
        <td>{musicitem.username}</td>
        <td>{musicitem.song}</td>
        <td>{musicitem.artist}</td>
        <td>{musicitem.album}</td>
        <td>{!this.state.toggle2 ? (
          <>
          <p>{Math.round(rate*100)/100}</p>
          <Button
            onClick={this.toggle2}
            className="feedbackButton"
            variant="contained"
            color="secondary"
            type="delete"
          >
            Rate
                </Button>
                </>
        ) : (
        <form onSubmit={this.rate}>
          <Select
            variant="outlined"
            required
            name="rate"
            //sets value of input to value of local state
            value={this.state.rate}
            onChange={(event) => this.handleChange(event, "rate")} //sends input values to local state
          >
            {/* select items 1 - 5 */}
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="1">1</MenuItem>
          </Select>
          <Button
            className="feedbackButton"
            variant="contained"
            color="secondary"
            type="delete"
          >
            Rate
                </Button>
                </form>
        )}
          </td>
       {this.props.user.username == musicitem.username ? (
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
