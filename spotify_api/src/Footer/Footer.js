import React, { Component } from "react";

// Footer is a controlled component that renders the footer of the site
class Footer extends Component {
    // React render function
    render() {
        let thisDate = new Date();
        let thisYear = thisDate.getFullYear();
        const copyright = "\u00A9";
        return (
            <footer className="App-footer">
                <p>
                    {copyright} Christopher Neisen {thisYear}
                </p>
            </footer>
        ); // end return
    } // end render
} // end class Footer

export default Footer;