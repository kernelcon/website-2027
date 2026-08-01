import { Component } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import camper from '../../static/images/off-grid/camper.png';
import dune from '../../static/images/off-grid/dune.jpg';
import hills from '../../static/images/off-grid/hills.svg';
import logo from '../../static/images/off-grid/logo.png';
import mountains from '../../static/images/off-grid/mountains.svg';
import peaks from '../../static/images/off-grid/peaks.svg';
import ray from '../../static/images/off-grid/ray.png';
import sitter from '../../static/images/off-grid/sitter.png';
import sky from '../../static/images/off-grid/sky.svg';
import stars1 from '../../static/images/off-grid/stars1.jpg';
import stars2 from '../../static/images/off-grid/stars2.png';

import './BackGround.scss';

gsap.registerPlugin(ScrollTrigger);

class BackGround extends Component {
  static displayName = 'BackGround';

  componentDidMount() {
    // --- Morse code setup ---
    const MORSE: Record<string, string> = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      ' ': ' '
    };

    const ray2 = document.getElementById('ray2');
    let previousWidth = window.innerWidth;

    const createPulse = (container: HTMLElement, delay: number, duration: number, type: string) => {
      const pulse = document.createElement('div');
      pulse.className = 'morse-pulse ' + type;
      pulse.style.bottom = '0';
      container.appendChild(pulse);
      gsap.fromTo(pulse, { bottom: 0 }, {
        bottom: '100%',
        duration: duration * 10,
        delay: delay,
        ease: 'power1.in',
        onComplete: () => pulse.remove(),
      });
    };

    const sendMorse = (message: string) => {
      if (!ray2) return 0;
      ray2.innerHTML = '';
      let time = 0;
      const unit = 0.3; // seconds per dot
      const morse = message.toUpperCase().split('').map(c => MORSE[c] || '').join(' ');
      morse.split('').forEach(symbol => {
        if (symbol === '.') {
          createPulse(ray2, time, unit, 'dot');
          time += unit * 2;
        } else if (symbol === '-') {
          createPulse(ray2, time, unit, 'dash');
          time += unit * 2;
        } else {
          time += unit * 6;
        }
      });
      return time;
    };

    const loopMorseMessages = (messages: string[]) => {
      let idx = 0;
      function next() {
        const duration = sendMorse(messages[idx]);
        idx = (idx + 1) % messages.length;
        setTimeout(next, duration * 1000 + 500);
      }
      next();
    };

    loopMorseMessages(['2027', 'KERNELCON', 'HACK THE PLANET', 'CTF']);

    // --- Helper functions ---
    const getSceneScale = () => Math.min(window.innerWidth / 2160, window.innerHeight / 3840);

    const updateScene = () => {
      const vh = window.innerHeight;
      const sceneScale = getSceneScale();
      const offscreenY = vh + 1000;
    
      const camperEl = document.getElementById("camper");
      const sitterEl = document.getElementById("sitter");
      const rayMaskEl = document.getElementById("ray-mask");
      const layerContainer = document.querySelector(".layer-container");
    
      // --- Dynamic sitter positioning ---
      function positionSitter() {
        if (!camperEl || !sitterEl || !layerContainer) return;
        const camperRect = camperEl.getBoundingClientRect();
        const containerRect = layerContainer.getBoundingClientRect();
        const camperTop = camperRect.top - containerRect.top;
        const camperHeight = camperRect.height;
    
        // Sitter sits just above camper
        const sitterOffset = camperHeight * 0.035; // tweak as needed
        sitterEl.style.top = camperTop + sitterOffset + "px";
      }
    
      // --- Dynamic ray mask height (keeps rays attached to dish) ---
      function updateRayMaskHeight() {
        if (!camperEl || !rayMaskEl || !layerContainer) return;
        const camperRect = camperEl.getBoundingClientRect();
        const containerRect = layerContainer.getBoundingClientRect();
        const camperHeight = camperRect.height;
        const camperTop = camperRect.top - containerRect.top;
    
        // Make the mask end slightly above the camper top
        const rayMaskBottom = camperTop + camperHeight * 0.08;
        rayMaskEl.style.height = rayMaskBottom + "px";
      }
    
      // Initial position updates
      positionSitter();
      updateRayMaskHeight();
    
      // Animate sitter slide-up from below its natural position
      gsap.set("#sitter", { y: 200 }); // start below
      gsap.to("#sitter", {
        y: 0,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "1000 top",
          scrub: true,
        },
      });
    
      // --- Mountains and foreground layers ---
      gsap.set("#far-mountains", { y: vh * 0.7 });
      gsap.to("#far-mountains", {
        y: vh * 0.2 - 100 * sceneScale,
        scrollTrigger: { trigger: "body", start: "top top", end: "400 top", scrub: true },
      });
    
      gsap.set("#mid-mountains", { y: vh * 0.9 });
      gsap.to("#mid-mountains", {
        y: vh * 0.3 - 100 * sceneScale,
        scrollTrigger: { trigger: "body", start: "top top", end: "420 top", scrub: true },
      });
    
      gsap.set("#near-mountains", { y: offscreenY });
      gsap.to("#near-mountains", {
        y: vh * 0.4 - 100 * sceneScale,
        scrollTrigger: { trigger: "body", start: "top top", end: "500 top", scrub: true },
      });
    
      gsap.set("#dune", { y: offscreenY });
      gsap.to("#dune", {
        y: vh * 0.45 - 80 * sceneScale,
        scrollTrigger: { trigger: "body", start: "top top", end: "600 top", scrub: true },
      });
    
      gsap.set("#camper", { y: offscreenY });
      gsap.to("#camper", {
        y: vh * 0.35 - 60 * sceneScale,
        scrollTrigger: { trigger: "body", start: "top top", end: "500 top", scrub: true },
      });
    
      // --- Rays animation ---
      gsap.set(".glow-ray", { y: 3000, opacity: 0 });
      gsap.to(".glow-ray", {
        y: -200 * sceneScale - 600,
        scrollTrigger: { trigger: "body", start: "top top", end: "1200 top", scrub: true },
      });
      gsap.to(".glow-ray", {
        opacity: 0.8,
        scrollTrigger: { trigger: "body", start: "500 top", end: "1000 top", scrub: true },
      });
    
      // --- Logo animation (stops 150px from top) ---
      gsap.set("#logo-container", { y: vh * 0.4, opacity: 0.6 });
      gsap.to("#logo-container", {
        y: 150,
        opacity: 1,
        scrollTrigger: { trigger: "body", start: "top top", end: "500 top", scrub: true },
      });
    
      // --- Glow & Pulse effects ---
      gsap.to(".glow", {
        filter: "drop-shadow(0 0 30px rgba(100,170,255,0.8))",
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: "sine.inOut",
      });
      gsap.to(".pulse", {
        scaleX: 0.9,
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: "sine.inOut",
      });
    
      // --- Continuous updates while scrolling ---
      gsap.ticker.add(positionSitter);
      gsap.ticker.add(updateRayMaskHeight);
    };

    const resizeReflow = () => {
      if (window.innerWidth !== previousWidth) {
        previousWidth = window.innerWidth;
        gsap.killTweensOf(".scene-layer, .glow-ray, #logo, #logo-text, #ray-mask");
        updateScene();
        ScrollTrigger.refresh();

        // Force a full reflow like original HTML
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll);
        ScrollTrigger.update();
        window.scrollTo(0, 0);
      }
    };

    // Listen for orientation change (iOS Safari fix)
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 300);
    });

    // Initial run
    updateScene();

    // Animate content section sliding up and pinning
    const isMobile = window.innerWidth <= 768;
    const mobileOffset = isMobile ? 13 : 0; // restore original 30vh offset on mobile
    
    gsap.to(".content", {
      y: `-${50 + mobileOffset}vh`, // scroll higher - 50vh up from starting position
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".content",
        start: "top bottom",  // start when it's below viewport
        end: "top 20%",       // end when content reaches 20% from top of viewport
        scrub: 0.5,           // smooth scroll with small delay
        pin: false,           // no pinning to prevent jumping
        pinSpacing: false     // prevent layout jumps
      }
    });

    // Debounced resize listener
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeReflow, 200);
    };
    window.addEventListener('resize', handleResize);
  }

  render() {
    return (
      <div>
        <div className="layer-container">
          <div id="background">
            <img id="sky" className="scene-layer base" src={sky} alt="Sky" />
            <img id="far-stars" className="scene-layer screen" src={stars1} alt="Far Stars" />
          </div>

          <img id="near-stars" className="scene-layer screen" src={stars2} alt="Near Stars" />
          <img id="far-mountains" className="scene-layer" src={peaks} alt="Far Mountains" />
          <img id="mid-mountains" className="scene-layer" src={mountains} alt="Mid Mountains" />
          <img id="near-mountains" className="scene-layer" src={hills} alt="Near Mountains" />
          <img id="dune" className="scene-layer" src={dune} alt="Dune" />
          <img id="sitter" className="glow" src={sitter} alt="Sitter" />
          <img id="camper" src={camper} alt="Camper" />

          <div id="ray-mask">
            <div id="ray2" className="glow-ray"></div>
            <img id="ray1" className="glow-ray pulse" src={ray} alt="Satellite" />
          </div>

          <div id="logo-container">
            <img id="logo" className="glow" src={logo} alt="Logo" />
            <div id="logo-text">kernelcon 2027 / 04.07.27 - 04.10.27</div>
          </div>
        </div>

        <main className="demo-content">
          <section style={{ minHeight: "120vh", margin: "0vh", padding: "4rem 2rem", color: "white" }}>
          </section>

          <section className="content">
            <h2 className="content-title">Welcome to Kernelcon</h2>
            <h4 className="content-subtitle">Unplug. Connect. Hack. Go Off Grid.</h4>
            <p className="content-paragraph">Out here, under the endless Midwest sky, technology feels different. It's raw. It's hands-on. 
              And its free from the digital noise of daily life. <strong>Kernelcon 2027</strong> invites you 
              to step off the grid and immerse yourself in a world where curiosity meets community.
            </p>

            <p className="content-paragraph">
              From sunrise keynotes to late-night hardware hacks, every moment is designed 
              to push your skills further and recharge your inspiration.  
              Whether you're exploring our villages, cracking challenges in the CTF, 
              or sharing stories around the afterparty,  
              you'll find yourself surrounded by people who live and breathe infosec.
            </p>

            <p className="content-paragraph">
              So leave the VR headset behind, feel the real breeze,  
              and come join one of the Midwest's premier security experiences.  
              Out here, it's not just about technology, it's about the people who shape it.
            </p>
          </section>

        </main>
      </div>

    );
  }
}

export default BackGround;
