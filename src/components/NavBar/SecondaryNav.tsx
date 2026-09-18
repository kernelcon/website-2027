import { Component } from "react";
import { Link } from "react-router-dom";
import ResponsiveMenu from "../ui/ResponsiveMenu";
import { FaBars, FaTimes } from "react-icons/fa";

import "./NavBar.scss";

export default class SecondaryNav extends Component {
	static displayName = "SecondaryNav";

	render() {
		return (
			<div className="secondary-nav">
				<div className="container nav-menu">
					<ResponsiveMenu
						menuOpenButton={<FaBars size={24} color="#dfdfdf" />}
						menuCloseButton={<FaTimes size={24} color="#dfdfdf" />}
						changeMenuOn="992px"
						largeMenuClassName="nav-large"
						smallMenuClassName="nav-small"
						menu={
							<div className="nav-links">
								<Link to="/agenda"><span className="nav-link-label">Agenda</span><span className="nav-link-sub">Talks &amp; Sessions</span></Link>
								{/* <Link to="/robo-race">Robo Race</Link> */}
								<Link to="/venue"><span className="nav-link-label">The Stage</span><span className="nav-link-sub">Hotel &amp; Venue</span></Link>
								<Link to="/dates"><span className="nav-link-label">Tour Dates</span><span className="nav-link-sub">Key Dates</span></Link>
								<Link to="/open-calls"><span className="nav-link-label">Submit a Track</span><span className="nav-link-sub">Open Calls</span></Link>
								<Link to="/sponsors"><span className="nav-link-label">Label Support</span><span className="nav-link-sub">Our Sponsors</span></Link>
								{/* <Link to="/safety">Safety</Link> */}
								<Link to="/about"><span className="nav-link-label">Credits</span><span className="nav-link-sub">About Us</span></Link>
							</div>
						}
					/>
				</div>
			</div>
		);
	}
}
