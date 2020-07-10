import React, { Component } from "react";

// Footer is a controlled component that renders the footer of the site
class Comments extends Component {
    // React render function
    render() {
  
        return (
            <tr><td>{this.props.comments}</td></tr>
        ); // end return
    } // end render
} // end class Footer

export default Comments;