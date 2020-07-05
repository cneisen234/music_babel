import React, { Component } from "react";
import { connect } from "react-redux";
import MusicItem from "../musicitem/musicitem"

class Recommendations extends Component {
  componentDidMount() {
    this.props.dispatch({ type: "FETCH_MUSIC" });
  }
  // React render function
  render() {
    return (
      <div className="App">
        <h1 className="App-title">RECOMMENDATIONS</h1>
        <div>
          <table id="musicTable">
            <thead>
              <tr>
                {/* table headers for recommendation display */}
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
              </tr>
            </thead>
            <tbody>
              {/* map through entire data query */}
              {this.props.reduxState.music.map((musicitem) => {
                // create MusicItem component for each mapped item, pass musicitem in as props, this gives us access to everything
                // for each mapped item within it's designated component
                return <MusicItem key={musicitem.id} musicitem={musicitem} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    ); //end return
  } //end render
} //end Recommendations
//redux state
const mapReduxStateToProps = (reduxState) => ({
  reduxState,
});

export default connect(mapReduxStateToProps)(Recommendations);