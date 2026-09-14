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
								<Link to="/venue">The Stage</Link>
								<Link to="/dates">Tour Dates</Link>
								<Link to="/open-calls">Submit a Track</Link>
								<Link to="/sponsors">Label Support</Link>
								{/* <Link to="/safety">Safety</Link> */}
								<Link to="/about">Credits</Link>
							</div>
						}
					/>
				</div>
			</div>
		);
	}
}
