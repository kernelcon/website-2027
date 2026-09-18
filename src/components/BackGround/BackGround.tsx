import { Component, createRef } from 'react';
import type { RefObject } from 'react';
import KernelLogo from '../../static/images/logos/kernelcon_white.png';
import './BackGround.scss';

const HEX_CHARS = '0123456789ABCDEF';
const ALGO_WORDS = ['ALGO', 'RHYTHM', '2027', 'CTF', 'HACK', '0xDEAD', 'RECON', 'XOR', 'NOP', 'ROP', 'PWN', 'FUZZ'];

interface BackGroundState {
  mounted: boolean;
}

export default class BackGround extends Component<object, BackGroundState> {
  static displayName = 'BackGround';

  private canvasRef = createRef<HTMLCanvasElement>();
  private waveCanvasRef = createRef<HTMLCanvasElement>();
  private cardRef = createRef<HTMLElement>();
  private animFrameId = 0;
  private waveFrameId = 0;
  private columns: number[] = [];
  private waveOffset = 0;

  constructor(props: object) {
    super(props);
    this.state = { mounted: false };
  }

  componentDidMount() {
    this.setState({ mounted: true });
    this.initHexRain();
    this.initWave();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleParallax, { passive: true });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animFrameId);
    cancelAnimationFrame(this.waveFrameId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleParallax);
  }

  handleParallax = () => {
    const card = this.cardRef.current;
    if (!card) return;
    const y = window.scrollY * 0.35;
    card.style.transform = `translateY(-${y}px)`;
  };

  handleResize = () => {
    this.initHexRain();
    this.initWave();
  };

  // ── HEX RAIN (Matrix-style but with hex and algo keywords) ──────────────────

  initHexRain() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(this.animFrameId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    this.columns = Array.from({ length: cols }, () => Math.random() * -canvas.height);

    let tick = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < this.columns.length; i++) {
        const y = this.columns[i];
        // Occasionally drop an algo keyword instead of single char
        const useWord = Math.random() < 0.002;
        const text = useWord
          ? ALGO_WORDS[Math.floor(Math.random() * ALGO_WORDS.length)]
          : HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];

        // Color cycling: mostly purple/green, occasional pink
        const phase = (i + tick) % 60;
        if (phase < 5)        ctx.fillStyle = '#ff006e'; // hot pink
        else if (phase < 20)  ctx.fillStyle = '#39ff14'; // neon green bright
        else if (phase < 40)  ctx.fillStyle = 'rgba(57,255,20,0.4)'; // faded green
        else                  ctx.fillStyle = 'rgba(123,47,255,0.5)'; // purple

        ctx.font = `${fontSize}px "Space Mono", monospace`;
        ctx.fillText(text, i * fontSize, y);

        this.columns[i] = y > canvas.height && Math.random() > 0.975
          ? 0
          : y + fontSize;
      }
      tick++;
      this.animFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  // ── WAVEFORM ────────────────────────────────────────────────────────────────

  initWave() {
    const canvas = this.waveCanvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(this.waveFrameId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = 160;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height / 2;
      const t = this.waveOffset;

      // Draw three overlapping sine waves
      const waves = [
        { amp: 45, freq: 0.018, phase: t * 0.8,  color: 'rgba(123,47,255,0.7)',  lw: 2 },
        { amp: 28, freq: 0.03,  phase: t * 1.3,  color: 'rgba(57,255,20,0.8)',   lw: 1.5 },
        { amp: 18, freq: 0.05,  phase: t * 0.5,  color: 'rgba(255,0,110,0.5)',   lw: 1 },
      ];

      waves.forEach(({ amp, freq, phase, color, lw }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = cy + amp * Math.sin(freq * x + phase)
                       + (amp * 0.4) * Math.sin(freq * 2.3 * x + phase * 1.1);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      this.waveOffset += 0.04;
      this.waveFrameId = requestAnimationFrame(draw);
    };
    draw();
  }

  render() {
    return (
      <div className="algo-hero">
        {/* Hex rain canvas */}
        <canvas ref={this.canvasRef} className="algo-rain-canvas" />

        {/* Grid overlay */}
        <div className="algo-grid-overlay" />

        {/* Scanlines */}
        <div className="algo-scanlines" />

        {/* Hero center content */}
        <div className="algo-hero-center">
          <div className="algo-pre-label">♪ KERNELCON PRESENTS ♪</div>

          <img
            src={KernelLogo}
            className="algo-logo"
            alt="Kernelcon logo"
          />

          <div className="algo-theme-line">
            <span className="algo-word">ALGO</span>
            <span className="algo-paren">(</span>
            <span className="algo-rhythm-word">RHYTHM</span>
            <span className="algo-paren">)</span>
          </div>

          <div className="algo-tagline">
            <span>Drop the beat.</span>
            <em> Break the algorithm.</em>
          </div>

          <div className="algo-dates-row">
            <div className="algo-date-chip">
              <span className="algo-date-label">Training</span>
              <span className="algo-date-val">MAR 2–3, 2027</span>
            </div>
            <div className="algo-date-sep">▶</div>
            <div className="algo-date-chip">
              <span className="algo-date-label">Conference</span>
              <span className="algo-date-val">MAR 4–5, 2027</span>
            </div>
            <div className="algo-date-sep">▶</div>
            <div className="algo-date-chip">
              <span className="algo-date-label">Venue</span>
              <span className="algo-date-val">OMAHA, NE</span>
            </div>
          </div>

          <div className="algo-cta-row">
            <a
              href="/register"
              className="algo-btn-primary"
            >
              Register
            </a>
            <a
              href="/agenda"
              className="algo-btn-secondary"
            >
              View Agenda
            </a>
          </div>
        </div>

        {/* Waveform strip at bottom */}
        <div className="algo-wave-strip">
          <canvas ref={this.waveCanvasRef} className="algo-wave-canvas" />
        </div>

        {/* EQ bars strip */}
        <div className="algo-eq-strip" aria-hidden="true">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="algo-eq-bar" />
          ))}
        </div>

        {/* Scroll content */}
        <main className="algo-scroll-content">
          <section className="algo-about-card" ref={this.cardRef as RefObject<HTMLElement>}>
            {/* content-eq-row removed */}
            <div className="content-label">♪ KERNELCON 2027 ♪</div>
            <h2 className="content-title">Welcome to Kernelcon</h2>
            <h4 className="content-subtitle">Drop the Beat. Break the Algorithm.</h4>
            <p className="content-paragraph">
              Every hacker knows the feeling — when keystrokes stop feeling like keystrokes
              and the system starts to open up. The pattern clicks. The noise drops away.
              That's the rhythm. <strong>Algo(Rhythm)</strong> is about that state: the intuitive
              cadence of someone who's put in the reps, reading a system the way a musician
              reads a room.
            </p>
            <p className="content-paragraph">
              Sometimes it's slow and deliberate — methodical recon, careful enumeration.
              Sometimes it's a frenetic improvised sprint when a window opens and you have
              seconds to act. Either way, the best hacking has a flow to it. Come find yours.
            </p>
            <div className="content-stats">
              <div className="content-stat">
                <span className="stat-num">30+</span>
                <span className="stat-label">Speakers</span>
              </div>
              <div className="content-stat">
                <span className="stat-num">2</span>
                <span className="stat-label">Days</span>
              </div>
              <div className="content-stat">
                <span className="stat-num">7</span>
                <span className="stat-label">Villages</span>
              </div>
              <div className="content-stat">
                <span className="stat-num">5</span>
                <span className="stat-label">Trainings</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}
