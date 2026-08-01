import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";

// Components
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import SecondaryNav from "./components/NavBar/SecondaryNav";

// Pages
import About from "./pages/About/About";
import Admin from "./pages/Admin/Admin";
import Bio from "./pages/Agenda/Bio";
import Dates from "./pages/Dates/Dates";
import OpenCalls from "./pages/OpenCalls/OpenCalls";
import CFP from "./pages/CFP/CFP";
import Home from "./pages/Home/Home";
import Sponsors from "./pages/Sponsors/Sponsors";
import Venue from "./pages/Venue/Venue";
import Register from "./pages/Register/Register";
import Training from "./pages/Training/Training";
import Agenda from "./pages/Agenda/Agenda";

import { withRouter } from "./router-compat";

import audio1 from "./static/audio/tmnt.mp3";
import audio2 from "./static/audio/punks-not-dead.mp3";
import audio3 from "./static/audio/jingly.mp3";

// Wrap pages that expect legacy match/history props.
const AboutR = withRouter(About);
const BioR = withRouter(Bio);
const VenueR = withRouter(Venue);
const AgendaR = withRouter(Agenda);

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
}

function useKonamiEasterEgg() {
  useEffect(() => {
    const pattern = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let current = 0;
    const audioArray = [audio1, audio2, audio3];
    const keyHandler = (event: KeyboardEvent) => {
      if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
        current = 0;
        return;
      }
      current++;
      if (pattern.length === current) {
        current = 0;
        const player = new Audio(audioArray[getRandomInt(3)]);
        void player.play();
        alert("Egg #2: Well done, someone is a fan of old video games.");
      }
    };
    document.addEventListener("keydown", keyHandler, false);
    return () => document.removeEventListener("keydown", keyHandler, false);
  }, []);
}

function App() {
  useKonamiEasterEgg();

  return (
    <BrowserRouter>
      <NavBar />
      <SecondaryNav />
      <div className="page-box">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutR />} />
          <Route path="/about/:tabId" element={<AboutR />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/bio" element={<BioR />} />
          <Route path="/dates" element={<Dates />} />
          <Route path="/open-calls" element={<OpenCalls />} />
          <Route path="/cfp" element={<CFP />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/venue" element={<VenueR />} />
          <Route path="/venue/:tabId" element={<VenueR />} />
          <Route path="/register" element={<Register />} />
          <Route path="/training" element={<Training />} />
          <Route path="/agenda" element={<AgendaR />} />
          <Route path="/agenda/:tabId" element={<AgendaR />} />
          <Route
            path="/dei"
            element={
              <ExternalRedirect to="https://docs.google.com/forms/d/e/1FAIpQLSezT5NG0_tkV3Wxd9D4t-58cU49Zd5t2Cun75ZkSx7GvD-KSg/viewform" />
            }
          />
          <Route
            path="/survey"
            element={
              <ExternalRedirect to="https://docs.google.com/forms/d/e/1FAIpQLSfU0wBk6uNAv7pgtTTnuX2B0Sde0OW0PnP_f8ekR-r42SiKHg/viewform" />
            }
          />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
