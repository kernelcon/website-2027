import { Link, useLocation } from "react-router-dom";
import KillerLogo from "../../static/images/logos/kernelcon_white.png";
import "./NavBar.scss";

interface Props {
  onOpenPlayer: () => void;
}

const NavBar = ({ onOpenPlayer }: Props) => {
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
          <p className="nav-dates">Algo(Rhythm) · Omaha, NE</p>
          <p className="second-nav-dates"><span className="nav-training-label">Training</span> Mar 2–3 · <span className="nav-conference-label">Conference</span> Mar 4–5</p>
        </Link>

        <div className="navbar-right">
          <button className="navbar-player-btn" onClick={onOpenPlayer} aria-label="Now Playing">
            ♫
          </button>
          <Link to="/register" className="navbar-register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
