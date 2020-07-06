import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button, Paper } from "@material-ui/core";
import swal from "sweetalert";
import axios from "axios";

class MusicItem extends Component {
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
//   flagForReview = (event) => {
//     //prevents default action
//     event.preventDefault();
//     //sweet alerts
//     swal({
//       title: "Flag this review?",
//       text: `Did you want to report this review?`,
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//       //end sweet alerts
//     }).then((confirm) => {
//       if (confirm) {
//         axios({
//           //start axios
//           method: "PUT",
//           url: `/confirm/${this.props.admin.id}`,
//         }) //end axios
//           .then((response) => {
//             //start .then
//           }) //end .then
//           .catch((error) => {
//             //start .catchError
//             console.log(error);
//           }); //end .catchError
//         //success! Review flagged
//         swal("This review has been flagged!", {
//           icon: "success",
//         });
//       } else {
//         //...else cancel
//         swal("Flag request has been canceled!");
//       }
//       //reloads page showing current info from database with newly flagged item
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);
//     });
//   };

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
        <td> <Button
          onClick={this.deleteMusic}
          className="feedbackButton"
          variant="contained"
          color="secondary"
          type="delete"
        >
          Delete
                </Button></td>

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
