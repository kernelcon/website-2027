import { Link, useLocation } from "react-router-dom";
import KillerLogo from "../../static/images/logos/kernelcon_white.png";
import "./NavBar.scss";

const NavBar = () => {
	const location = useLocation();
	const isHomeRoute = location.pathname === "/";

	return (
		<div className={`navbar ${isHomeRoute ? 'navbar-transparent' : 'navbar-dark'}`}>
			<div className="container navbar-inner">
				<Link to="/" className="navbar-brand">
					<img
						src={KillerLogo}
						className="navbar-logo-k25"
						height="30"
						alt="kernelcon logo"
					/>

					<p className="nav-dates">Training: Apr 7-8</p>
					<p className="second-nav-dates">Conference: Apr 9-10</p>
				</Link>
				<Link to="/register" className="navbar-register">
					Register
				</Link>
			</div>
		</div>
	);
};

export default NavBar;
