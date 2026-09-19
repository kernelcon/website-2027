import { useState, useRef, useEffect, useCallback } from 'react';
import stillDG from '../../static/audio/ytcracker - still dg.mp3';
import popAShell from '../../static/audio/bytestealer-pop-a-shell.m4a';
import allTheThings from '../../static/audio/dual-core-all-the-things.m4a';
import yourProblem from '../../static/audio/bytestealer-your-problem.m4a';
import yourProblemCover from '../../static/images/album-covers/your-problem-byte-stealer.png';
import allTheThingsCover from '../../static/images/album-covers/all-the-things-dual-core.avif';
import nerdLifeCover from '../../static/images/album-covers/nerd-life-yt-cracker.webp';
import popAShellCover from '../../static/images/album-covers/pop-a-shell-byte-stealer.png';
import './NowPlaying.scss';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  producer: string;
  src: string | null;
  cover?: string;
  hidden?: boolean;
  links?: { spotify?: string; instagram?: string; };
}

const TRACKS: Track[] = [
  { id: 1,  title: 'Still DG',       artist: 'ytcracker',    album: 'Nerd Life',      producer: 'Nerdy South Records', src: stillDG,      cover: nerdLifeCover,     links: { spotify: 'https://open.spotify.com/artist/1x82Mu3wakMkldMW5kEiP4', instagram: 'https://www.instagram.com/y7cracker' } },
  { id: 2,  title: 'Pop a Shell',    artist: 'Byte Stealer', album: 'Byte Stealer',   producer: 'Byte Back Records',   src: popAShell,    cover: popAShellCover,    links: { spotify: 'https://open.spotify.com/artist/3t8jdJKpmhP7WvjlAkobkj' } },
  { id: 3,  title: 'All The Things', artist: 'Dual Core',    album: 'All The Things', producer: 'c64',                 src: allTheThings, cover: allTheThingsCover, links: { spotify: 'https://open.spotify.com/artist/7tiEDqYPwBHFd5LBWRFK4U', instagram: 'https://www.instagram.com/dualcoremusic' } },
  { id: 4,  title: 'Your Problem',   artist: 'Byte Stealer', album: 'Byte Stealer',   producer: 'Byte Back Records',   src: yourProblem,  cover: yourProblemCover,  links: { spotify: 'https://open.spotify.com/artist/3t8jdJKpmhP7WvjlAkobkj' } },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NowPlaying({ isOpen, onClose }: Props) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = queue[current] ?? TRACKS[0];

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
    }
    setPlaying(false);
    setProgress(0);
  }, []);

  const startAudio = useCallback((src: string, onEnd: () => void) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
    }
    const audio = new Audio(src);
    audio.ontimeupdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    audio.onended = onEnd;
    audioRef.current = audio;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const goTo = useCallback((idx: number, autoplay = false) => {
    stopAudio();
    setCurrent(idx);
    if (autoplay && queue[idx]?.src) {
      setTimeout(() => startAudio(queue[idx].src!, () => goTo((idx + 1) % queue.length, true)), 0);
    }
  }, [stopAudio, startAudio, queue]);

  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else if (track.src) {
      if (audioRef.current && audioRef.current.src.includes(encodeURIComponent(track.src.split('/').pop() ?? ''))) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        startAudio(track.src, () => goTo((current + 1) % queue.length, true));
      }
    }
  };

  const prev = () => goTo((current - 1 + queue.length) % queue.length, playing);
  const next = () => goTo((current + 1) % queue.length, playing);

  useEffect(() => {
    if (isOpen) {
      setQueue(shuffle(TRACKS.filter(t => !t.hidden)));
      setCurrent(0);
    } else {
      stopAudio();
    }
  }, [isOpen, stopAudio]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Cleanup on unmount
  useEffect(() => () => stopAudio(), [stopAudio]);


  if (!isOpen) return null;

  return (
    <div className="np-overlay" onClick={onClose}>
      <div className="np-modal" onClick={e => e.stopPropagation()}>

        {/* Left panel */}
        <div className="np-left">
          <p className="np-pre-label">♪ NOW PLAYING</p>

          {/* Album art */}
          <div className={`np-art ${playing ? 'np-art--playing' : ''}`}>
            {track.cover
              ? <img src={track.cover} alt={track.album} className="np-art-img" />
              : <div className="np-art-placeholder">♪</div>
            }
            {!playing && <div className="np-art-paused">▐▐</div>}
          </div>

          {/* Track info */}
          <div className="np-track-info">
            <h2 className="np-title">{track.title}</h2>
            <p className="np-artist">{track.artist}</p>
          </div>

          {/* Progress bar */}
          <div className="np-progress">
            <div className="np-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>

          {/* Controls */}
          <div className="np-controls">
            <button className="np-ctrl" onClick={prev} aria-label="Previous">◀◀</button>
            <button className={`np-ctrl np-ctrl--play ${!track.src ? 'np-ctrl--disabled' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? '⏸' : '▶'}
            </button>
            <button className="np-ctrl" onClick={next} aria-label="Next">▶▶</button>
          </div>

          {/* TLR Credits */}
          <div className="np-credits">
            <div className="np-credit-row"><span className="np-credit-label">Artist</span><span className="np-credit-val">{track.artist}</span></div>
            <div className="np-credit-row"><span className="np-credit-label">Album</span><span className="np-credit-val">{track.album}</span></div>
            <div className="np-credit-row"><span className="np-credit-label">Prod</span><span className="np-credit-val">{track.producer}</span></div>
            {track.links && (
              <div className="np-artist-links">
                {track.links.spotify && (
                  <a href={track.links.spotify} target="_blank" rel="noopener noreferrer" className="np-artist-link" aria-label="Spotify">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                    Spotify
                  </a>
                )}
                {track.links.instagram && (
                  <a href={track.links.instagram} target="_blank" rel="noopener noreferrer" className="np-artist-link" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — track list */}
        <div className="np-right">
          <p className="np-pre-label">TRACKLIST</p>
          <p className="np-blurb">Every great con has a rhythm. These are the songs we live in while we build, break, and learn — and we'll keep adding to the tracklist all the way up to the con. Got a recommendation? Tweet us at <a href="https://twitter.com/_kernelcon_" target="_blank" rel="noopener noreferrer" className="np-blurb-link">@_kernelcon_</a></p>
          <ul className="np-tracklist">
            {queue.map((t, i) => (
              <li key={t.id}
                  className={`np-track-item${i === current ? ' active' : ''}${!t.src ? ' disabled' : ''}`}
                  onClick={() => t.src && goTo(i, true)}>
                <span className="np-track-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="np-track-title">{t.title}</span>
                <span className="np-track-artist">{t.artist}</span>
                {i === current && playing && <span className="np-playing-dot" />}
              </li>
            ))}
          </ul>
        </div>

        {/* Close */}
        <button className="np-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
