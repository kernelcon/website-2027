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
								<Link to="/agenda">Agenda</Link>
								{/* <Link to="/robo-race">Robo Race</Link> */}
								<Link to="/venue">Venue</Link>
								<Link to="/dates">Dates</Link>
								{/* <Link to="/open-calls">Open Calls</Link> */}
								<Link to="/cfp">CFP</Link>
								<Link to="/training">Training & Workshops</Link>
								<Link to="/sponsors">Sponsors</Link>
								{/* <Link to="/safety">Safety</Link> */}
								<Link to="/about">About</Link>
							</div>
						}
					/>
				</div>
			</div>
		);
	}
}
