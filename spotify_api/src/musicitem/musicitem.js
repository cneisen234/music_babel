import React, { Component } from "react";
import { connect } from "react-redux";
import Comments from "../comments/comments";
import { TextField, Button, Paper, Select, MenuItem } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import GradeIcon from '@material-ui/icons/Grade';
import EditIcon from '@material-ui/icons/Edit';
import Rating from '@material-ui/lab/Rating';
import swal from "sweetalert";

class MusicItem extends Component {
  //local state
  state = {
    id: null,
    username: "",
    usercomment: "",
    song: "",
    artist: "",
    album: "",
    toggle: false,
    toggle2: false,
    toggle3: false,
    rate: null,
    comment: ""
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
            //routes to axios in sagas
            this.props.dispatch({
              type: 'DELETE_MUSIC', payload: this.props.musicitem.id[0]
            })
        //success! review deleted
        swal("Poof! Your recommendation has been deleted!", {
          icon: "success",
        });
      } else {
        //...else cancel action
        swal("Your recommendation is safe!");
      }
    });
  }; //end deleteReview

  //edits current song with a PUT request
  editRecommendation = (event) => {
    //prevents default action
    event.preventDefault();
    const { username } = this.props.user;
    const { song, artist, album } = this.state 
    //sweet alerts
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
        //runs axios request in sagas
        this.props.dispatch({
          type: 'EDIT_MUSIC', payload: {
            id: this.props.musicitem.id,
            songData: {
            username: username,
            song: song,
            artist: artist,
            album: album,
          }},
        })
          //saved edited changes
        swal("Your changes have been saved!", {
          icon: "success",
        });
      } else {
        //...else cancel
        swal("No changes were made!");
      }
      this.toggle();
    });
  };
  //rates current song
  rate = (event) => {
    //prevents default action
    event.preventDefault();

    //grabs keys in Redux state
    const { id, song } = this.props.musicitem;
    //grabs key in local state
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
        //runs axios request in sagas
        this.props.dispatch({
          type: 'ADD_RATE', payload: {
            id: id[0],
            rate: rate,
          }
        })
        //success! Info POSTED to database
        swal("Thank you for your rating!", {
          icon: "success",
        });
        //...else canceled
      } else {
        swal("Your rating submission was canceled!");
      }
      //runs toggle2 to switchback to main view window on submission, switches back also at cancel
      this.toggle2();
    })
    //resets local state
    this.setState({
    rate: null
    })
  };

  comment = (event) => {
    //prevents default action
    event.preventDefault();

    //grabs keys in Redux state
    const { id, song } = this.props.musicitem;
    //grabs key in local state
    const { comment } = this.state
    //sweet alerts
    swal({
      //confirmation page exists in sweet alerts notification
      title: "Confirm your comment",
      text: `Please confirm your comment on ${song} below
        ${comment}
        click "ok" to confirm`,
      icon: "info",
      buttons: true,
      dangerMode: true,
      //end sweet alerts
    }).then((confirm) => {//start .then
      if (confirm) {
        //runs axios request in sagas
        this.props.dispatch({
          type: 'ADD_COMMENT', payload: {
            id: id[0],
            usercomment: this.props.user.username,
            comment: comment,
          }
        })
        //success! Info POSTED to database
        swal("Thank you for your comment!", {
          icon: "success",
        });
        //...else canceled
      } else {
        swal("Your comment submission was canceled!");
      }
      //runs toggle3 to switchback to main view window on submission, switches back also at cancel
      // this.toggle3();
    })
    //resets local state
    this.setState({
      comment: "",
      usernamecomment: "",
    })
  };

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value }); //sets to value of targeted event
  }; //end handleChange
  //toggles edit window
  toggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };
  //toggle2 for switching back and forth from rating and mainscreen
  toggle2 = () => {
    this.setState({
      toggle2: !this.state.toggle2,
    });
  };
  //toggle3 for switching back and forth from rating and mainscreen
  toggle3 = () => {
    this.setState({
      toggle3: !this.state.toggle3,
    });
  };
  render() {
    //grabs music item from mapped props
    const { musicitem } = this.props;
    //defines varables of AVG rating coming from redux out of SQL
    let rate = this.props.musicitem.rate
    //to get round AVG rating down to 2nd decimal point
    rate = Math.round(rate * 100) / 100
    return (
      // displays list of recommended songs from database
      <table>
      <tr>
        {/* table data for each mapped item */}
        <td><b>Posted by:</b><br /> {musicitem.username}</td>
        <td><b>Title:</b><br />{musicitem.song}</td>
        <td><b>Artist:</b><br />{musicitem.artist}</td>
        <td><b>Album:</b><br />{musicitem.album}</td>
        </tr>
        <tr>
          {/* checked is user is logged in, rating, edit and delete only appear if user is logged in */}
        {this.props.user.username ? (
          // if toggle2 is false then render mainscreen
            <td>{!this.state.toggle2 && this.props.user.username ? (
          <>
          {/* converts AVG rating from SQL to star rating posted to DOM */}
            <div className="rating" onClick={this.toggle2}><b>Average Rating:</b><Rating
              size="small"
              readOnly
              value={rate}
              precision={0.1}
              max={5}
            /></div>
            {/* a window pops up when hovering over AVG rating, informing user to click to rate */}
            <div className="info">
              Click here to vote on {musicitem.song}
            </div>
                </>
        ) : (
          //...else render voting screen
        <form onSubmit={this.rate}>
          <Select
            style= {{
              backgroundColor: "white",
            }}
            variant="outlined"
            required
            name="rate"
            //sets value of input to value of local state
            value={this.state.rate}
            onChange={(event) => this.handleChange(event, "rate")} //sends input values to local state
          >
            {/* select items 1 - 5 */}
            <MenuItem value="5"><Rating value={5} readOnly size="small"/></MenuItem>
            <MenuItem value="4"><Rating value={4} readOnly size="small"/></MenuItem>
            <MenuItem value="3"><Rating value={3} readOnly size="small"/></MenuItem>
            <MenuItem value="2"><Rating value={2} readOnly size="small"/></MenuItem>
            <MenuItem value="1"><Rating value={1} readOnly size="small" /></MenuItem>
          </Select>
          {/* submit rating and saves to database, value of AVG is collective of all votes for that song */}
          <Button
            className="feedbackButton"
            variant="contained"
            color="secondary"
            type="delete"
          >
                    <GradeIcon />
                </Button>
                </form>
        )}
          </td>
        ) : (
          //...if user is not logged in, render nothing
          <span></span>
        )}
        {/* is the logged in user the one who posted recommendation? If so, display options to edit and delete */}
       {this.props.user.username == musicitem.username ? (
                  <>
        <td> 
          {/* onclick, delete */}
          <Button
          onClick={this.deleteMusic}
          variant="contained"
          color="secondary"
          type="delete"
        >
          <DeleteIcon />
                </Button></td>
                {/* toggles edit box on click for that song */}
        <td><Button
          onClick={this.toggle}
          variant="contained"
          color="secondary"
          type="delete"
        >
                <EditIcon />
                </Button></td>
                </>
       ) : (
         //...if user is not the one who made the recommendation, don't render delete or edit
         <span></span>
)}
          <td><Button
            onClick={this.toggle3}
            variant="contained"
            color="secondary"
            type="delete"
          >
            View Comments
              </Button></td>
            {/* toggles edit window */}
                {this.state.toggle === false ? (
                  //if toggle is false, render nothing. This is the default
                  <span></span>
                ) : (
                  //...else render the edit screen for the selected song
            <Paper
              style={{
                left: 0,
                bottom: 0,
                position: "fixed",
                borderRadius: "10%",
                height: "400px",
                width: "400px",
                fontSize: "15px",
                backgroundColor: "white",
                zIndex: Infinity,
              }}
              elevation="24"
              className="loginBox"
              ><td style={{
                backgroundColor: "white",
              }}> <form onSubmit={this.editRecommendation}>
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
          />
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
          />
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
          <br />
          {/* onClick tied to form element, runs submitInfo on click */}
          <button
            className="recommendationButton"
            variant="contained"
            color="secondary"
            type="submit"
          >
            Edit recommendation
            </button>
        </form>
        {/* toggles edit window back to not displaying */}
                <button
                  onClick={this.toggle}
                  className="recommendationButton"
                  variant="contained"
                  color="secondary"
                  type="submit"
                >
                  Go Back
            </button></td></Paper>
                )}

          {/* toggles comment window */}
          {this.state.toggle3 === false ? (
            //if toggle is false, render nothing. This is the default
            <span></span>
          ) : (
              //...else render the edit screen for the selected song
              <Paper
                style={{
                  left: 0,
                  bottom: 0,
                  position: "fixed",
                  borderRadius: "10%",
                  height: "800px",
                  width: "400px",
                  fontSize: "15px",
                  backgroundColor: "white",
                  zIndex: Infinity,
                  overflow: "scroll",
                }}
                elevation="24"
                className="loginBox"
              ><td style={{
                backgroundColor: "white",
              }}> <form onSubmit={this.comment}>
                    {/* album */}
                    <TextField
                      variant="outlined"
                      required
                      label="Comment"
                      name="Comment"
                      // sets value of input to local state
                      value={this.state.comment}
                      type="text"
                      maxLength={1000}
                      onChange={(event) => this.handleChange(event, "comment")} //onChange of input values set local state
                    />
                    <br />
                    {/* onClick tied to form element, runs submitInfo on click */}
                    <button
                      className="recommendationButton"
                      variant="contained"
                      color="secondary"
                      type="submit"
                    >
                      Comment
            </button>
                  </form>
                  <table>
                    {musicitem.comment.map((comments, index) => {
                      return <Comments key={index} comments={comments}/>;}
                    )}
                  </table>
                    
                 
                    
                  <button
                    onClick={this.toggle3}
                    className="recommendationButton"
                    variant="contained"
                    color="secondary"
                    type="submit"
                  >
                    Go Back
            </button></td></Paper>
            )}
      </tr>
      </table>
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
