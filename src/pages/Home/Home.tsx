import { Component, useState, useRef, useEffect, useCallback } from "react";
import BackGround from '../../components/BackGround/BackGround';
import KernelconLogoUrl from '../../static/images/logos/kernelcon_white.png';
import "./Home.scss";

// Preload logo once at module level so every draw() call can use it synchronously
const _logoImg = new Image();
_logoImg.src = KernelconLogoUrl;

// ── DATA ──────────────────────────────────────────────────────────────────────

// `start` (YYYY-MM-DD) drives the status: the most recent milestone that has
// started is highlighted as "playing", earlier ones are done, later ones pending.
const KEY_DATES = [
  { num: "01", date: "SEP 2026",  start: "2026-09-01", title: "Registration Opens",       sub: "Conference and training passes on sale" },
  { num: "02", date: "SEP 2026",  start: "2026-09-01", title: "Open Calls Open",          sub: "Call for papers, training, and villages" },
  { num: "03", date: "NOV 2026",  start: "2026-11-14", title: "Call for Training Closes", sub: "Last day to submit training proposals" },
  { num: "04", date: "DEC 2026",  start: "2026-12-19", title: "Call for Papers Closes",   sub: "Last day to submit talks" },
  { num: "05", date: "JAN 2027",  start: "2027-01-27", title: "Keynotes Announced",       sub: "Keynote speakers revealed" },
  { num: "06", date: "MAR 2–3",  start: "2027-03-02", title: "Training",                 sub: "Pre-conference training at the Hilton Omaha" },
  { num: "07", date: "MAR 4–5",  start: "2027-03-04", title: "Kernelcon 2027",           sub: "Main conference at the Hilton Omaha" },
];

function getKeyDateStatuses(today = new Date()) {
  const toDate = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const started = KEY_DATES.filter((k) => toDate(k.start) <= today);
  const currentStart = started.length ? started[started.length - 1].start : null;
  return KEY_DATES.map((k) => {
    if (k.start === currentStart) return { ...k, status: "finale" };
    if (toDate(k.start) <= today) return { ...k, status: "done" };
    return { ...k, status: "coming" };
  });
}

// const KEYNOTES = [
//   { name: "Casey Ellis",    org: "cje.io",      badge: "Keynote" },
//   { name: "Phillip Wylie",  org: "Suzu Labs",   badge: "Keynote" },
// ];

// const PERFORMERS = [
//   { name: "Matt Scheurer",        track: '"Definitely Not Secure (DNS)"' },
//   { name: "Danny Quist",          track: '"Malware Reverse Engineering in a Post-C World"' },
//   { name: "f8al",                 track: '"All Keys Lost: An Adventure In Car Hacking"' },
//   { name: "Megan Benoit",         track: '"Dumb Ways to Die 2: Scary Stories"' },
//   { name: "Ickler & Drysdale",    track: '"Why You Got Hacked in 2026"' },
//   { name: "Jamieson & Weiss",     track: '"Why Integer Factorization is F****** Hard"' },
//   { name: "Andrew (DoctorEww)",   track: '"Ctrl + C = Control Me"' },
//   { name: "Ryan Bonner",          track: '"A Series Of Unfortunate Event (Listeners)"' },
//   { name: "FaultLine",            track: '"A Multi-Architecture Tool for Persistent PLT Hooking"' },
//   { name: "kn0ck0ut",             track: '"Bluetooth Warwalking"' },
// ];

const TRAININGS = [
  { num: "01", title: "Active Directory Security Hardening",   instructor: "Jordan Drysdale & Kent Ickler" },
  { num: "02", title: "AI for Cyber Security Professionals",   instructor: "Joff Thyer & Derek Banks" },
  { num: "03", title: "Harnessing LLMs for Application Security", instructor: "Seth Law & Ken Johnson" },
  { num: "04", title: "Assembly & Reverse Engineering",        instructor: "Dr. Matt Miller" },
  { num: "05", title: "Offensive Tooling for Operators",       instructor: "Chris Traynor" },
];

const STAGES = [
  { icon: "🎫", name: "Badge Village",          desc: "Hardware quests and interactive badge challenges. Solve puzzles. Unlock achievements." },
  { icon: "📻", name: "HAM Radio Village",      desc: "Old-school frequencies. The original wireless hacks. Before WiFi there was RF." },
  { icon: "🔧", name: "Hardware Hacking",       desc: "Embedded systems, IoT, and hardware exploitation. Build and break in equal measure." },
  { icon: "🔐", name: "Lockpicking Village",    desc: "Physical security, locks, vaults. The original social engineering is a tension wrench." },
  { icon: "📡", name: "Radio Hacking Outpost",  desc: "SDR, WiFi, signal exploitation. The airwaves are never safe when we're around." },
  { icon: "💚", name: "Mental Health Village",  desc: "Recharge between sets. Talk to humans. Rest is part of the craft." },
  { icon: "🎨", name: "Hack/Craft Village",     desc: "Screen printing, DTF, making things. Because hackers make art too." },
];

const EVENTS = [
  {
    date: "THURSDAY // MARCH 4TH // BY PWP LIVE",
    name: "KERNELCON\nCARNAGE",
    tagline: '"The mosh pit goes full contact."',
    desc: "Pro wrestling at a hacker conference. Yes, really. PWP Live brings the body slams and submission holds to Omaha. The most unhinged crossover event since someone patched a kernel live on stage. Come for the chaos.",
    accent: "green",
  },
  {
    date: "FRIDAY // MARCH 5TH // CLOSING NIGHT",
    name: "KERNEL\nPANIC LIVE",
    tagline: '"The encore you\'ve been waiting for."',
    desc: "The closing night party. Open bar, music, and that special hacker hospitality that only exists when hundreds of people who break things for fun are finally allowed to just… relax. Don't skip the encore.",
    accent: "pink",
  },
];

const BATTLES = [
  {
    tag: "Boss Fight Mode",
    name: "Escape Room",
    motto: '"Can you escape the AI-pocalypse?"',
    desc: "By Falkor Security. 30 minutes. Team of 6. AI has gone rogue and you're locked in with it. This is the boss fight. Survive or be absorbed. Most teams don't make it out.",
    color: "pink",
  },
  {
    tag: "The Algo Mini-Game",
    name: "Corn Cob Catcher",
    motto: '"Nebraska\'s own rhythm game."',
    desc: "Catch falling corn cobs. It's ridiculous. It's Nebraska. It's weirdly competitive. High score gets bragging rights and the respect of everyone watching you play it completely seriously.",
    color: "yellow",
  },
  {
    tag: "The Remix Battle",
    name: "CTF",
    motto: '"Remix the flags. Win eternal glory."',
    desc: "The annual Capture the Flag. Web, reversing, crypto, pwn: every genre represented. Top performers win Eternal Kernel badges and the kind of respect that can't be bought. Only earned.",
    color: "purple",
  },
];

const FAQS = [
  {
    q: "Do I need security experience to attend?",
    a: "Not even a little. Kernelcon welcomes everyone from first-timers to 20-year veterans. All you need is curiosity and a love of learning. The best shows are the ones where the crowd surprises you.",
  },
  {
    q: "Is there WiFi? Is it safe?",
    a: "Yes, there's WiFi. Semi-hostile. Treat it like a festival mosh pit (fun, but protective gear is recommended). Bring a VPN like a good roadie. Think of it as part of the experience.",
  },
  {
    q: "What's the refund policy?",
    a: "No refunds, but passes are fully transferable. Can't make it? Find someone who deserves your spot and hand it off. The show must go on.",
  },
  {
    q: "What should I submit a talk about?",
    a: "Anything in infosec is fair game. Offensive, defensive, hardware, cloud, research, war stories, philosophy. Original work preferred. Kernel puns in the title earn extra credit. We're serious about that.",
  },
  {
    q: "Are sessions recorded or streamed?",
    a: "Not streamed. Some recordings may go up afterward, but there's no guarantee. Some magic only happens live. If you want to catch the set, you have to be there.",
  },
  {
    q: "Is there a dress code?",
    a: "None. Come as you are. Rock star, hacker, or both. We've seen everything and judged nothing. Just show up with your brain and your badge.",
  },
];

// ── STUDIO (Multi-instrument Web Audio) ──────────────────────────────────────

const FREQS: Record<string, number> = {
  'C2': 65.41,'C#2': 69.30,'D2': 73.42,'D#2': 77.78,
  'E2': 82.41,'F2': 87.31,'F#2': 92.50,'G2': 98.00,
  'G#2':103.83,'A2':110.00,'A#2':116.54,'B2':123.47,
  'C3':130.81,'C#3':138.59,'D3':146.83,'D#3':155.56,
  'E3':164.81,'F3':174.61,'F#3':185.00,'G3':196.00,
  'G#3':207.65,'A3':220.00,'A#3':233.08,'B3':246.94,
  'C4':261.63,'C#4':277.18,'D4':293.66,'D#4':311.13,
  'E4':329.63,'F4':349.23,'F#4':369.99,'G4':392.00,
  'G#4':415.30,'A4':440.00,'A#4':466.16,'B4':493.88,
  'C5':523.25,
};

// ── Piano sample loading (Salamander Grand Piano via Tone.js CDN) ─────────────
// Files use 's' for sharp: D#3 → Ds3.mp3, F#4 → Fs4.mp3
const PIANO_SAMPLE_MAP: Record<string, string> = {
  'C2':'C2', 'C#2':'C2', 'D2':'Ds2', 'D#2':'Ds2', 'E2':'Ds2', 'F2':'Fs2', 'F#2':'Fs2',
  'G2':'Fs2','G#2':'A2', 'A2':'A2',  'A#2':'A2',  'B2':'A2',
  'C3':'C3', 'C#3':'C3', 'D3':'Ds3', 'D#3':'Ds3', 'E3':'Ds3', 'F3':'Fs3', 'F#3':'Fs3',
  'G3':'Fs3','G#3':'A3', 'A3':'A3',  'A#3':'A3',  'B3':'A3',
  'C4':'C4', 'C#4':'C4', 'D4':'Ds4', 'D#4':'Ds4', 'E4':'Ds4', 'F4':'Fs4', 'F#4':'Fs4',
  'G4':'Fs4','G#4':'A4', 'A4':'A4',  'A#4':'A4',  'B4':'A4',
  'C5':'C5',
};
const SALM_HZ: Record<string, number> = {
  'C2':65.41, 'Ds2':77.78, 'Fs2':92.50, 'A2':110.00,
  'C3':130.81,'Ds3':155.56,'Fs3':185.00,'A3':220.00,
  'C4':261.63,'Ds4':311.13,'Fs4':369.99,'A4':440.00,
  'C5':523.25,
};
const pianoCache = new Map<string, AudioBuffer>();
let pianoLoadStarted = false;
function loadPianoSamples(ctx: AudioContext) {
  if (pianoLoadStarted) return;
  pianoLoadStarted = true;
  const keys = [...new Set(Object.values(PIANO_SAMPLE_MAP))];
  keys.forEach(async (k) => {
    try {
      const r = await fetch(`https://tonejs.github.io/audio/salamander/${k}.mp3`);
      if (!r.ok) return;
      pianoCache.set(k, await ctx.decodeAudioData(await r.arrayBuffer()));
    } catch { /* synthesis fallback stays active */ }
  });
}

// ── Guitar acoustic samples (nbrosowsky mirror) ────────────────────────────────
const GUIT_AC_BASE = 'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/';
const GUIT_AC_MAP: Record<string, string> = {
  'C2':'D2',   'C#2':'D2',  'D2':'D2',   'D#2':'Ds2', 'E2':'E2',   'F2':'F2',
  'F#2':'Fs2', 'G2':'G2',   'G#2':'Gs2', 'A2':'A2',   'A#2':'As2', 'B2':'B2',
  'C3':'C3',   'C#3':'Cs3', 'D3':'D3',   'D#3':'Ds3', 'E3':'E3',   'F3':'F3',
  'F#3':'Fs3', 'G3':'G3',   'G#3':'G3',  'A3':'A3',   'A#3':'A3',  'B3':'C4',
  'C4':'C4',   'C#4':'C4',  'D4':'C4',   'D#4':'E4',  'E4':'E4',   'F4':'E4',
  'F#4':'Fs4', 'G4':'G4',   'G#4':'Gs4', 'A4':'A4',   'A#4':'As4', 'B4':'B4',
  'C5':'C5',
};
const GUIT_AC_HZ: Record<string, number> = {
  'D2':73.42,'Ds2':77.78,'E2':82.41,'F2':87.31,'Fs2':92.50,'G2':98.00,'Gs2':103.83,
  'A2':110.00,'As2':116.54,'B2':123.47,
  'C3':130.81,'Cs3':138.59,'D3':146.83,'Ds3':155.56,'E3':164.81,'F3':174.61,'Fs3':185.00,'G3':196.00,
  'A3':220.00,'C4':261.63,'E4':329.63,'Fs4':369.99,'G4':392.00,'Gs4':415.30,
  'A4':440.00,'As4':466.16,'B4':493.88,'C5':523.25,
};
const acousticCache = new Map<string, AudioBuffer>();
let acousticLoadStarted = false;
function loadAcousticSamples(ctx: AudioContext) {
  if (acousticLoadStarted) return;
  acousticLoadStarted = true;
  const keys = [...new Set(Object.values(GUIT_AC_MAP))];
  keys.forEach(async (k) => {
    try {
      const r = await fetch(`${GUIT_AC_BASE}${k}.mp3`);
      if (!r.ok) return;
      acousticCache.set(k, await ctx.decodeAudioData(await r.arrayBuffer()));
    } catch {}
  });
}

// ── Guitar electric samples (nbrosowsky mirror) ────────────────────────────────
const GUIT_EL_BASE = 'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/';
const GUIT_EL_MAP: Record<string, string> = {
  'C2':'A2',   'C#2':'A2',  'D2':'A2',   'D#2':'A2',  'E2':'A2',   'F2':'A2',
  'F#2':'A2',  'G2':'A2',   'G#2':'A2',  'A2':'A2',   'A#2':'C3',  'B2':'C3',
  'C3':'C3',   'C#3':'C3',  'D3':'Ds3',  'D#3':'Ds3', 'E3':'Ds3',  'F3':'Fs3',
  'F#3':'Fs3', 'G3':'Fs3',  'G#3':'A3',  'A3':'A3',   'A#3':'A3',  'B3':'C4',
  'C4':'C4',   'C#4':'C4',  'D4':'C4',   'D#4':'Fs4', 'E4':'Fs4',  'F4':'Fs4',
  'F#4':'Fs4', 'G4':'Fs4',  'G#4':'A4',  'A4':'A4',   'A#4':'A4',  'B4':'A4',
  'C5':'A4',
};
const GUIT_EL_HZ: Record<string, number> = {
  'A2':110.00,'C3':130.81,'Ds3':155.56,'Fs3':185.00,'A3':220.00,'C4':261.63,'Fs4':369.99,'A4':440.00,
};
const guitarElCache = new Map<string, AudioBuffer>();
let guitarElLoadStarted = false;
function loadGuitarElSamples(ctx: AudioContext) {
  if (guitarElLoadStarted) return;
  guitarElLoadStarted = true;
  const keys = [...new Set(Object.values(GUIT_EL_MAP))];
  keys.forEach(async (k) => {
    try {
      const r = await fetch(`${GUIT_EL_BASE}${k}.mp3`);
      if (!r.ok) return;
      guitarElCache.set(k, await ctx.decodeAudioData(await r.arrayBuffer()));
    } catch {}
  });
}

// ── Bass electric samples (nbrosowsky mirror) ──────────────────────────────────
const BASS_BASE = 'https://nbrosowsky.github.io/tonejs-instruments/samples/bass-electric/';
const BASS_MAP: Record<string, string> = {
  'C2':'Cs2',  'C#2':'Cs2', 'D2':'Cs2',  'D#2':'E2',  'E2':'E2',   'F2':'E2',
  'F#2':'G2',  'G2':'G2',   'G#2':'G2',  'A2':'As2',  'A#2':'As2', 'B2':'As2',
  'C3':'Cs3',  'C#3':'Cs3', 'D3':'Cs3',  'D#3':'E3',  'E3':'E3',   'F3':'E3',
  'F#3':'G3',  'G3':'G3',   'G#3':'G3',  'A3':'As3',  'A#3':'As3', 'B3':'As3',
  'C4':'Cs4',  'C#4':'Cs4', 'D4':'Cs4',  'D#4':'Cs4',
};
const BASS_HZ: Record<string, number> = {
  'As1':58.27,'Cs2':69.30,'E2':82.41,'G2':98.00,
  'As2':116.54,'Cs3':138.59,'E3':164.81,'G3':196.00,
  'As3':233.08,'Cs4':277.18,
};
const bassCache = new Map<string, AudioBuffer>();
let bassLoadStarted = false;
function loadBassSamples(ctx: AudioContext) {
  if (bassLoadStarted) return;
  bassLoadStarted = true;
  const keys = [...new Set(Object.values(BASS_MAP))];
  keys.forEach(async (k) => {
    try {
      const r = await fetch(`${BASS_BASE}${k}.mp3`);
      if (!r.ok) return;
      bassCache.set(k, await ctx.decodeAudioData(await r.arrayBuffer()));
    } catch {}
  });
}

// ─── Soprano "Choir Ah" samples — Sonatina Symphonic Orchestra (real recordings) ─
// CDN: jsDelivr via peastman/sso; files are WAV, ~1.5MB each, female chorus
// # in filenames must be URL-encoded as %23
const SSO_BASE = 'https://cdn.jsdelivr.net/gh/peastman/sso@master/Sonatina%20Symphonic%20Orchestra/Samples-looped/Chorus/';
// Dense sample set G4–C6 (every 1-3 semitones where demos typically play)
const CHOIR_KEYS: {sKey: string; fileName: string; hz: number}[] = [
  {sKey:'G4',  fileName:'chorus-female-g4',    hz:392.00},
  {sKey:'A4',  fileName:'chorus-female-a4',    hz:440.00},
  {sKey:'B4',  fileName:'chorus-female-b4',    hz:493.88},
  {sKey:'C5',  fileName:'chorus-female-c5',    hz:523.25},
  {sKey:'D5',  fileName:'chorus-female-d5',    hz:587.33},
  {sKey:'E5',  fileName:'chorus-female-e5',    hz:659.25},
  {sKey:'G5',  fileName:'chorus-female-g5',    hz:784.00},
  {sKey:'A#5', fileName:'chorus-female-a%235', hz:932.33},
  {sKey:'C6',  fileName:'chorus-female-c6',    hz:1046.50},
];
const CHOIR_HZ: Record<string, number> = Object.fromEntries(CHOIR_KEYS.map(k => [k.sKey, k.hz]));
// Map G4–C6 to nearest sample (notes below F4 fall through to synthesis)
const CHOIR_MAP: Record<string, string> = {
  'F4':'G4','F#4':'G4',              // 1-2 semitones up — fine
  'G4':'G4','G#4':'G4',
  'A4':'A4','A#4':'A4',
  'B4':'B4',
  'C5':'C5','C#5':'C5',
  'D5':'D5','D#5':'D5',
  'E5':'E5','F5':'E5','F#5':'E5',
  'G5':'G5','G#5':'G5',
  'A5':'A#5','A#5':'A#5','B5':'A#5',
  'C6':'C6',
};
const choirCache = new Map<string, AudioBuffer>();
let choirLoadStarted = false;
function loadChoirSamples(ctx: AudioContext) {
  if (choirLoadStarted) return;
  choirLoadStarted = true;
  CHOIR_KEYS.forEach(async ({sKey, fileName}) => {
    try {
      const r = await fetch(`${SSO_BASE}${fileName}.wav`);
      if (!r.ok) return;
      choirCache.set(sKey, await ctx.decodeAudioData(await r.arrayBuffer()));
    } catch {}
  });
}

// ─── Male Choir — SSO real orchestral male chorus recordings (C3–F4) ──────────
// SSO male chorus — real orchestral recordings, C3–F4 range
const VOX_BASE = 'https://cdn.jsdelivr.net/gh/peastman/sso@master/Sonatina%20Symphonic%20Orchestra/Samples-looped/Chorus/';
const VOX_KEYS: {sKey: string; fileName: string; hz: number}[] = [
  {sKey:'C3',  fileName:'chorus-male-c3',    hz:130.81},
  {sKey:'D#3', fileName:'chorus-male-d%233', hz:155.56},
  {sKey:'F#3', fileName:'chorus-male-f%233', hz:185.00},
  {sKey:'A3',  fileName:'chorus-male-a3',    hz:220.00},
  {sKey:'C4',  fileName:'chorus-male-c4',    hz:261.63},
  {sKey:'D#4', fileName:'chorus-male-d%234', hz:311.13},
  {sKey:'F4',  fileName:'chorus-male-f4',    hz:349.23},
];
const VOX_HZ: Record<string, number> = Object.fromEntries(VOX_KEYS.map(k => [k.sKey, k.hz]));
// Male SSO samples cover C3–F4; notes above are silent (soprano handles G4+)
const VOX_MAP: Record<string, string> = {
  'C3':'C3','C#3':'C3',
  'D3':'D#3','D#3':'D#3',
  'E3':'D#3','F3':'F#3','F#3':'F#3',
  'G3':'F#3','G#3':'A3',
  'A3':'A3','A#3':'A3',
  'B3':'C4',
  'C4':'C4','C#4':'C4',
  'D4':'D#4','D#4':'D#4',
  'E4':'D#4','F4':'F4',
};
const voxCache = new Map<string, AudioBuffer>();
let voxLoadStarted = false;
function loadVoxSamples(ctx: AudioContext) {
  if (voxLoadStarted) return;
  voxLoadStarted = true;
  VOX_KEYS.forEach(async ({sKey, fileName}) => {
    try {
      const r = await fetch(`${VOX_BASE}${fileName}.wav`);
      if (!r.ok) return;
      voxCache.set(sKey, await ctx.decodeAudioData(await r.arrayBuffer()));
    } catch {}
  });
}

// ── KERNELCON! voice bank — Web Speech API (Chrome's online Google TTS voices) ─
let cornVoices: SpeechSynthesisVoice[] = [];
function initCornVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const load = () => {
    cornVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  };
  load();
  window.speechSynthesis.addEventListener('voiceschanged', load);
}
// All piano keys in order, used to assign one voice per key
const ALL_PIANO_KEYS = [
  'B2',
  'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
  'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5',
];

const WHITE_KEYS = ['B2','C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5'];
const BLACK_KEYS = [
  // all positions shifted +80 to account for the prepended B2 white key
  {note:'C#3',left:136},{note:'D#3',left:216},
  {note:'F#3',left:376},{note:'G#3',left:456},{note:'A#3',left:536},
  {note:'C#4',left:696},{note:'D#4',left:776},
  {note:'F#4',left:936},{note:'G#4',left:1016},{note:'A#4',left:1096},
];
const KB_MAP: Record<string,string> = {
  // white keys
  z:'B2',
  q:'C3',w:'D3',e:'E3',r:'F3',t:'G3',y:'A3',u:'B3',
  a:'C4',s:'D4',d:'E4',f:'F4',g:'G4',h:'A4',j:'B4',k:'C5',
  // black keys — 1-0 consecutive
  '1':'C#3','2':'D#3','3':'F#3','4':'G#3','5':'A#3',
  '6':'C#4','7':'D#4','8':'F#4','9':'G#4','0':'A#4',
};
const DRUM_KB: Record<string,string> = {z:'kick',x:'snare',c:'hihat',v:'tom',b:'clap',n:'cymbal'};
const INSTRUMENTS = [
  {id:'piano',   name:'Piano',    icon:'🎹',color:'#39ff14'},
  {id:'synth',   name:'Synth',   icon:'◈', color:'#7b2fff'},
  {id:'basetone',name:'Base Tone',   icon:'◎', color:'#aa2266'},
  {id:'pad',     name:'Pad',     icon:'∿', color:'#ffe600'},
  {id:'pluck',   name:'Pluck',   icon:'✦', color:'#00cfff'},
  {id:'drums',   name:'Drums',   icon:'🥁',color:'#ff8800'},
  {id:'guitar',  name:'Electric',icon:'🎸', color:'#ff4400'},
  {id:'bass',    name:'Bass',    icon:'🎸',color:'#ff006e'},
  {id:'acoustic',name:'Acoustic',icon:'🎸',color:'#c8a050'},
  {id:'banjo',   name:'Banjo',   icon:'🪕',color:'#d4a050'},
  {id:'organ',   name:'Organ',   icon:'⚙', color:'#cc00ff'},
  {id:'strings', name:'Strings', icon:'🎻',color:'#ffaaff'},
  {id:'soprano',  name:'Choir Ah',  icon:'🎤',color:'#ffccff'},
  {id:'vocalOoh', name:'Choir Ooh', icon:'≈', color:'#ffbbee'},
  {id:'corn',     name:'KERNELCON!',icon:'🌽',color:'#ffe600'},
  {id:'mic',      name:'Mic Input', icon:'🎙', color:'#ff6b6b'},
];
const DRUM_PADS = [
  {id:'kick',  name:'KICK',  key:'Z',color:'#ff006e'},
  {id:'snare', name:'SNARE', key:'X',color:'#ffe600'},
  {id:'hihat', name:'HI-HAT',key:'C',color:'#00cfff'},
  {id:'tom',   name:'TOM',   key:'V',color:'#7b2fff'},
  {id:'clap',  name:'CLAP',  key:'B',color:'#39ff14'},
  {id:'cymbal',name:'CYMBAL',key:'N',color:'#ff8800'},
];

interface NoteEvent { note: string; t: number; }
interface MicMods { semitones: number; gain: number; filter: 'none'|'tel'|'bass'|'bright'|'robot'|'deep'; echo: boolean; echoMs: number; }
interface MicPlayback { audio: HTMLAudioElement; gainNode?: GainNode; filterNode?: BiquadFilterNode; delayNode?: DelayNode; oscNodes?: OscillatorNode[]; }
const DEFAULT_MIC_MODS: MicMods = { semitones: 0, gain: 1, filter: 'none', echo: false, echoMs: 200 };

function makeDistortionCurve(amount: number): Float32Array {
  const n = 256; const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function ensureAudioCtx(ref: React.MutableRefObject<AudioContext|null>): AudioContext {
  if (!ref.current) {
    ref.current = new (window.AudioContext ||
      (window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext)();
  }
  return ref.current;
}
interface TrackMods {
  semitones: number; gain: number; pan: number;
  filterType: 'none'|'lowpass'|'highpass'|'bandpass'; filterFreq: number;
  echo: boolean; echoMs: number; reverb: number;
}
const DEFAULT_TRACK_MODS: TrackMods = {
  semitones: 0, gain: 1, pan: 0,
  filterType: 'none', filterFreq: 2000,
  echo: false, echoMs: 300, reverb: 0,
};
const _reverbCache = new Map<string, AudioBuffer>();
const makeReverbBuf = (ctx: AudioContext, decaySec: number): AudioBuffer => {
  const key = `${ctx.sampleRate}:${decaySec.toFixed(1)}`;
  if (_reverbCache.has(key)) return _reverbCache.get(key)!;
  const len = Math.floor(ctx.sampleRate * decaySec);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  _reverbCache.set(key, buf);
  return buf;
};

interface Track { id: number; inst: string; events: NoteEvent[]; dur: number; baseDur: number; chunks: number; muted: boolean; audioUrl?: string; micMods?: MicMods; mods?: TrackMods; }
interface ExampleTrack { inst: string; events: NoteEvent[]; }
interface Example { name: string; emoji: string; desc: string; dur: number; tracks: ExampleTrack[]; chorus?: boolean; }

// Generates repeated note events at regular intervals — used for drum patterns
const seq = (note: string, s: number, e: number, step: number): NoteEvent[] =>
  Array.from({length: Math.ceil((e - s) / step)}, (_, i) => ({note, t: s + i * step}));

const EXAMPLES: Example[] = [
  {
    name: 'SYSTEM BREACH', emoji: '⚡', desc: 'Dark techno with driving kick and synths · C minor · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,     24000, 500),   // 4-on-the-floor kick (120 BPM)
        ...seq('snare', 500,   24000, 1000),  // beats 2+4
        ...seq('hihat', 8250,  16000, 250),   // section B 8th-note hihats (enter at 8s)
        ...seq('hihat', 16125, 24000, 125),   // section C 16th-note frenzy (enter at 16s)
        {note:'cymbal',t:0},{note:'cymbal',t:8000},{note:'cymbal',t:16000},
        {note:'clap',t:4000},{note:'clap',t:6000},   // section A sparse claps
        {note:'clap',t:20000},{note:'clap',t:22000}, // section C claps return
      ]},
      { inst: 'synth', events: [
        // Synth enters at 8s (bar 5) — Cm arpeggio ascending/descending
        {note:'C4',t:8000},{note:'D#4',t:8250},{note:'G4',t:8500},{note:'A#4',t:8750},
        {note:'A#4',t:9000},{note:'G4',t:9250},{note:'D#4',t:9500},{note:'C4',t:9750},
        {note:'F4',t:10000},{note:'A#4',t:10250},{note:'C5',t:10500},{note:'A#4',t:10750},
        {note:'G4',t:11000},{note:'F4',t:11250},{note:'D#4',t:11500},{note:'C4',t:11750},
        {note:'C4',t:12000},{note:'D#4',t:12250},{note:'G4',t:12500},{note:'A#4',t:12750},
        {note:'C5',t:13000},{note:'A#4',t:13250},{note:'G4',t:13500},{note:'D#4',t:13750},
        {note:'F4',t:14000},{note:'G4',t:14250},{note:'A#4',t:14500},{note:'C5',t:14750},
        {note:'A#4',t:15000},{note:'G4',t:15250},{note:'D#4',t:15500},{note:'C4',t:15750},
        // Section C (16s): wider leaps, more intensity
        {note:'C4',t:16000},{note:'G4',t:16250},{note:'C5',t:16500},{note:'G4',t:16750},
        {note:'D#4',t:17000},{note:'A#4',t:17250},{note:'D#4',t:17500},{note:'C4',t:17750},
        {note:'F4',t:18000},{note:'C5',t:18250},{note:'A#4',t:18500},{note:'G4',t:18750},
        {note:'F4',t:19000},{note:'D#4',t:19250},{note:'C4',t:19500},{note:'A#3',t:19750},
        {note:'C4',t:20000},{note:'D#4',t:20250},{note:'F4',t:20500},{note:'G4',t:20750},
        {note:'A#4',t:21000},{note:'C5',t:21250},{note:'A#4',t:21500},{note:'G4',t:21750},
        {note:'F4',t:22000},{note:'D#4',t:22250},{note:'C4',t:22500},{note:'A#3',t:22750},
        {note:'C4',t:23000},{note:'D#4',t:23250},{note:'G4',t:23500},{note:'A#4',t:23750},
      ]},
      { inst: 'basetone', events: [
        // Sub-bass pedal (plays one octave below): C2 rumble under each section root
        {note:'C3',t:0},{note:'C3',t:4000},{note:'F3',t:8000},
        {note:'C3',t:12000},{note:'G3',t:16000},{note:'C3',t:20000},
      ]},
      { inst: 'bass', events: [
        // Section A: driving Cm pulse (0-8s)
        {note:'C3',t:0},{note:'G3',t:500},{note:'A#3',t:1000},{note:'G3',t:1500},
        {note:'F3',t:2000},{note:'G3',t:2500},{note:'A#3',t:3000},{note:'G3',t:3500},
        {note:'C3',t:4000},{note:'C3',t:4500},{note:'D#3',t:5000},{note:'G3',t:5500},
        {note:'F3',t:6000},{note:'A#3',t:6500},{note:'G3',t:7000},{note:'C3',t:7500},
        // Section B: color shifts (8-16s)
        {note:'C3',t:8000},{note:'G3',t:8500},{note:'A#3',t:9000},{note:'D#3',t:9500},
        {note:'F3',t:10000},{note:'G3',t:10500},{note:'A#3',t:11000},{note:'G3',t:11500},
        {note:'C3',t:12000},{note:'C3',t:12500},{note:'G3',t:13000},{note:'A#3',t:13500},
        {note:'G3',t:14000},{note:'F3',t:14500},{note:'A#3',t:15000},{note:'C4',t:15500},
        // Section C: peak energy (16-24s)
        {note:'C3',t:16000},{note:'D#3',t:16500},{note:'G3',t:17000},{note:'A#3',t:17500},
        {note:'C4',t:18000},{note:'A#3',t:18500},{note:'G3',t:19000},{note:'F3',t:19500},
        {note:'D#3',t:20000},{note:'F3',t:20500},{note:'G3',t:21000},{note:'A#3',t:21500},
        {note:'C4',t:22000},{note:'G3',t:22500},{note:'D#3',t:23000},{note:'C3',t:23500},
      ]},
    ],
  },
  {
    // 100 BPM · beat=600ms · 8th=300ms · bar=2400ms · 10 bars = 24s
    // A blues scale (A C D D# E G) — original tune, not based on any existing song
    name: 'ALGO BLUES', emoji: '🎸', desc: 'Electric blues shuffle with guitar riffs · A blues · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,   24000, 1200), // beats 1+3
        ...seq('snare', 600, 24000, 1200), // beats 2+4
        ...seq('hihat', 300, 24000, 600),  // off-beats
        {note:'cymbal',t:0},{note:'cymbal',t:12000},
        {note:'clap',t:4800},{note:'clap',t:9600},{note:'clap',t:19200},
      ]},
      { inst: 'bass', events: [
        // Walking A minor bass, 10 bars — root movement on beats 1+3
        {note:'A3',t:0},    {note:'E3',t:600},
        {note:'A3',t:1200}, {note:'G3',t:1800},
        {note:'A3',t:2400}, {note:'C4',t:3000},
        {note:'E4',t:3600}, {note:'D4',t:4200},
        {note:'C4',t:4800}, {note:'A3',t:5400},
        {note:'E3',t:6000}, {note:'G3',t:6600},
        {note:'A3',t:7200}, {note:'A3',t:7800},
        {note:'C4',t:8400}, {note:'D4',t:9000},
        {note:'E4',t:9600}, {note:'E4',t:10200},
        {note:'D4',t:10800},{note:'C4',t:11400},
        {note:'A3',t:12000},{note:'E3',t:12600},
        {note:'G3',t:13200},{note:'A3',t:13800},
        {note:'A3',t:14400},{note:'C4',t:15000},
        {note:'E4',t:15600},{note:'G4',t:16200},
        {note:'A4',t:16800},{note:'G4',t:17400},
        {note:'E4',t:18000},{note:'C4',t:18600},
        {note:'A3',t:19200},{note:'E3',t:19800},
        {note:'G3',t:20400},{note:'A3',t:21000},
        {note:'A3',t:21600},{note:'C4',t:22200},
        {note:'E4',t:22800},{note:'A3',t:23400},
      ]},
      { inst: 'guitar', events: [
        // Guitar enters bar 4 (7200ms): A blues scale riff with blues flat-5 (D#4)
        // Phrase 1 (7200-9600): Call
        {note:'A3',t:7200},{note:'C4',t:7500},{note:'D4',t:7800},{note:'D#4',t:8100},
        {note:'E4',t:8400},{note:'D4',t:8700},{note:'C4',t:9000},{note:'A3',t:9300},
        // Phrase 2 (9600-12000): Response, climbs higher
        {note:'A3',t:9600},{note:'C4',t:9900},{note:'E4',t:10200},{note:'G4',t:10500},
        {note:'A4',t:10800},{note:'G4',t:11100},{note:'E4',t:11400},{note:'D4',t:11700},
        // Phrase 3 (12000-14400): Peak + blue note bends
        {note:'E4',t:12000},{note:'G4',t:12300},{note:'A4',t:12600},{note:'G4',t:12900},
        {note:'E4',t:13200},{note:'D#4',t:13500},{note:'D4',t:13800},{note:'C4',t:14100},
        // Phrase 4 (14400-16800): Low call + high answer
        {note:'A3',t:14400},{note:'C4',t:14700},{note:'D4',t:15000},{note:'E4',t:15300},
        {note:'G4',t:15600},{note:'E4',t:15900},{note:'D4',t:16200},{note:'C4',t:16500},
        // Phrase 5 (16800-19200): Double-stop feel, push rhythm
        {note:'A3',t:16800},{note:'E4',t:17100},{note:'A4',t:17400},{note:'E4',t:17700},
        {note:'G4',t:18000},{note:'E4',t:18300},{note:'D4',t:18600},{note:'C4',t:18900},
        // Phrase 6 (19200-21600): Rising climax
        {note:'A3',t:19200},{note:'C4',t:19500},{note:'D4',t:19800},{note:'D#4',t:20100},
        {note:'E4',t:20400},{note:'G4',t:20700},{note:'A4',t:21000},{note:'G4',t:21300},
        // Phrase 7 (21600-24000): Resolution, settles on root
        {note:'E4',t:21600},{note:'D4',t:21900},{note:'C4',t:22200},{note:'A3',t:22500},
        {note:'G3',t:22800},{note:'A3',t:23100},{note:'C4',t:23400},{note:'A3',t:23700},
      ]},
    ],
  },
  /* DRAGON GATE — commented out
  {
    // 80 BPM, D major pentatonic (D E F# A B), 8 bars = 24s
    // Deliberate call-and-response phrases, builds from sparse to full then resolves
    name: 'DRAGON GATE', emoji: '🐉', desc: 'Eastern koto with call and response · D pentatonic · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'pluck', events: [
        // Bar 1 (0-3000): Opening call — sparse, D ascending to peak
        {note:'D4',t:0},{note:'F#4',t:1125},{note:'A4',t:1500},{note:'B4',t:2250},
        // Bar 2 (3000-6000): Answer — B descends back to D
        {note:'A4',t:3000},{note:'F#4',t:3750},{note:'E4',t:4125},{note:'D4',t:4875},
        // Bar 3 (6000-9000): Second call — lower register contrast
        {note:'A3',t:6000},{note:'D4',t:6750},{note:'F#4',t:7125},{note:'A4',t:7500},{note:'B4',t:8250},
        // Bar 4 (9000-12000): Answer with ornament — slightly busier
        {note:'A4',t:9000},{note:'F#4',t:9375},{note:'A4',t:9750},{note:'B4',t:10125},
        {note:'A4',t:10500},{note:'F#4',t:10875},{note:'D4',t:11625},
        // Bar 5 (12000-15000): Development — 8th note run, first real momentum
        {note:'D4',t:12000},{note:'E4',t:12375},{note:'F#4',t:12750},{note:'A4',t:13125},
        {note:'B4',t:13500},{note:'A4',t:14000},{note:'F#4',t:14375},{note:'E4',t:14750},
        // Bar 6 (15000-18000): Ascending sweep to peak
        {note:'D4',t:15000},{note:'F#4',t:15375},{note:'A4',t:15750},{note:'B4',t:16125},
        {note:'A4',t:16500},{note:'F#4',t:16875},{note:'E4',t:17250},{note:'D4',t:17625},
        // Bar 7 (18000-21000): Climax — high register, urgent 8ths
        {note:'A4',t:18000},{note:'B4',t:18375},{note:'A4',t:18750},{note:'F#4',t:19125},
        {note:'E4',t:19500},{note:'F#4',t:19875},{note:'A4',t:20250},{note:'B4',t:20625},
        // Bar 8 (21000-24000): Resolution — long descent to root D
        {note:'A4',t:21000},{note:'F#4',t:21375},{note:'E4',t:21750},{note:'D4',t:22125},
        {note:'D4',t:22500},{note:'A3',t:23250},{note:'D4',t:23625},
      ]},
      { inst: 'strings', events: [
        // Sustained pads that shift with the phrase structure
        {note:'D3',t:0},{note:'A3',t:150},{note:'D4',t:300},       // bars 1-2: D open
        {note:'B3',t:6000},{note:'D4',t:6150},{note:'F#4',t:6300}, // bars 3-4: Bm color
        {note:'D3',t:12000},{note:'F#3',t:12150},{note:'A3',t:12300}, // bars 5-6: D fuller
        {note:'E3',t:18000},{note:'A3',t:18150},{note:'D4',t:18300}, // bars 7-8: E tension → D resolve
        {note:'D3',t:21000},{note:'A3',t:21150},
      ]},
      { inst: 'organ', events: [
        // Temple bell: deep, sparse — one per phrase start, marks the sections
        {note:'D3',t:200},
        {note:'B3',t:6200},
        {note:'D3',t:12200},
        {note:'E3',t:18200},
        {note:'D3',t:22200},
      ]},
      { inst: 'drums', events: [
        // Taiko: "Don" (kick) on phrase beats, "Ka" (tom) fills entering bar 3
        // Bars 1-2: just cymbal crash + sparse kick
        {note:'cymbal',t:0},{note:'kick',t:0},{note:'kick',t:3000},
        // Bars 3-4: Add tom fills
        {note:'kick',t:6000},{note:'tom',t:7500},{note:'kick',t:9000},{note:'tom',t:10500},
        // Bars 5-6: Driving — kick every bar + tom on upbeats
        {note:'kick',t:12000},{note:'cymbal',t:12000},
        {note:'kick',t:13500},{note:'tom',t:14250},
        {note:'kick',t:15000},{note:'kick',t:16500},{note:'tom',t:17250},
        // Bars 7-8: Climax energy then settle
        {note:'kick',t:18000},{note:'cymbal',t:18000},
        {note:'kick',t:18750},{note:'kick',t:19500},{note:'tom',t:20250},
        {note:'kick',t:21000},{note:'tom',t:22500},
      ]},
    ],
  },
  */ // end DRAGON GATE
  {
    // STALK OVERFLOW — G Dorian (G A Bb C D E F), 100 BPM, 8th=300ms, bar=2400ms, 10 bars=24s
    // Banjo-driven folk melody meets synth pads — original composition
    // 1200ms intro gap lets the corn "Kernelcon!" shout land before the band kicks in
    name: 'STALK OVERFLOW', emoji: '🌽', desc: 'Banjo meets synth in a folk groove · G Dorian · 100 BPM · 24s',
    dur: 25200,
    tracks: [
      { inst: 'corn', events: [{note:'C#3',t:0}] },
      { inst: 'banjo', events: [
        // Bars 1-2: Opening motif — G ascending, Bb (the Dorian blue note), back down
        {note:'G4',t:1200},{note:'A4',t:1500},{note:'A#4',t:1800},{note:'A4',t:2100},
        {note:'G4',t:2400},{note:'E4',t:2700},{note:'D4',t:3000},{note:'G4',t:3300},
        {note:'D4',t:3600},{note:'E4',t:3900},{note:'G4',t:4200},{note:'A4',t:4500},
        {note:'A#4',t:4800},{note:'A4',t:5100},{note:'G4',t:5400},{note:'D4',t:5700},
        // Bars 3-4: Development — sweep to high C5, answer down through F4
        {note:'G4',t:6000},{note:'A#4',t:6300},{note:'C5',t:6600},{note:'A#4',t:6900},
        {note:'A4',t:7200},{note:'G4',t:7500},{note:'F4',t:7800},{note:'D4',t:8100},
        {note:'G4',t:8400},{note:'A4',t:8700},{note:'G4',t:9000},{note:'E4',t:9300},
        {note:'D4',t:9600},{note:'C4',t:9900},{note:'D4',t:10200},{note:'G3',t:10500},
        // Bars 5-6: Synth joins — banjo climbs with it
        {note:'G3',t:10800},{note:'D4',t:11100},{note:'G4',t:11400},{note:'A#4',t:11700},
        {note:'A4',t:12000},{note:'G4',t:12300},{note:'E4',t:12600},{note:'G4',t:12900},
        {note:'A4',t:13200},{note:'A#4',t:13500},{note:'A4',t:13800},{note:'G4',t:14100},
        {note:'F4',t:14400},{note:'G4',t:14700},{note:'A4',t:15000},{note:'A#4',t:15300},
        // Bars 7-8: Full ensemble peak — fast 8ths, wide range
        {note:'G4',t:15600},{note:'A4',t:15900},{note:'A#4',t:16200},{note:'C5',t:16500},
        {note:'A#4',t:16800},{note:'A4',t:17100},{note:'G4',t:17400},{note:'E4',t:17700},
        {note:'D4',t:18000},{note:'E4',t:18300},{note:'G4',t:18600},{note:'A4',t:18900},
        {note:'G4',t:19200},{note:'A#4',t:19500},{note:'A4',t:19800},{note:'G4',t:20100},
        // Bars 9-10: Outro — wind down back to root
        {note:'G4',t:20400},{note:'E4',t:20700},{note:'D4',t:21000},{note:'C4',t:21300},
        {note:'D4',t:21600},{note:'G3',t:21900},{note:'G4',t:22200},{note:'A4',t:22500},
        {note:'A#4',t:22800},{note:'A4',t:23100},{note:'G4',t:23400},{note:'D4',t:23700},
        {note:'G3',t:24000},{note:'D4',t:24300},{note:'G4',t:24600},{note:'G3',t:24900},
      ]},
      { inst: 'synth', events: [
        // Synth chords enter bar 5 — G Dorian harmony, sustained pads
        {note:'G3',t:10800},{note:'D4',t:10950},{note:'A#3',t:11100},   // Gm
        {note:'G3',t:13200},{note:'C4',t:13350},{note:'E4',t:13500}, // C major (Dorian IV)
        {note:'G3',t:15600},{note:'A#3',t:15750},{note:'D4',t:15900},{note:'F4',t:16050}, // Gm7
        {note:'A3',t:18000},{note:'E4',t:18150},{note:'G4',t:18300}, // Am
        {note:'G3',t:20400},{note:'D4',t:20550},{note:'A#3',t:20700}, // Gm
        {note:'C4',t:22800},{note:'G4',t:22950},{note:'E4',t:23100}, // C
        {note:'G3',t:24000},{note:'D4',t:24150},{note:'G4',t:24300}, // G resolve
      ]},
      { inst: 'bass', events: [
        // Bass enters bar 3, root-fifth pattern following G Dorian chords
        {note:'G3',t:6000},{note:'D4',t:7200},
        {note:'G3',t:8400},{note:'A3',t:9600},
        {note:'G3',t:10800},{note:'D4',t:12000},
        {note:'C4',t:13200},{note:'G3',t:14400},
        {note:'G3',t:15600},{note:'D4',t:16800},
        {note:'A3',t:18000},{note:'G3',t:19200},
        {note:'G3',t:20400},{note:'C4',t:21600},
        {note:'G3',t:22800},{note:'G3',t:24000},
      ]},
      { inst: 'drums', events: [
        // Light folk groove — sparse intro, builds to full by bar 5
        {note:'cymbal',t:1200},
        ...seq('kick',  1200, 6000,  2400), // bars 1-2: just kick
        ...seq('kick',  6000, 25200, 1200), // bars 3-10: full kick pattern
        ...seq('snare', 6600, 25200, 1200), // snare enters bar 3
        ...seq('hihat', 10800, 25200, 600), // hihat enters bar 5
        {note:'cymbal',t:10800},{note:'cymbal',t:20400},
        {note:'tom',t:15600},{note:'tom',t:18000},{note:'tom',t:22200},
      ]},
    ],
  },

  // ── 10 NEW DEMOS ──────────────────────────────────────────────────────────

  /* KERNEL PIG — commented out
  {
    // Pig Step-inspired: F minor · 120 BPM · lo-fi jazz hip-hop
    // beat=500ms, 8th=250ms, 16th=125ms, bar=2000ms, 12 bars=24s
    // F minor scale: F G G# A# C D# (using sharps: G#=Ab, A#=Bb, C#=Db, D#=Eb)
    name: 'KERNEL PIG', emoji: '🐷',
    desc: 'Lazy lo-fi hip-hop with jazzy piano · F minor · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Pig Step groove: kick 1+3, syncopated "and-of-2" kick, snare 2+4, off-beat hihats
        ...seq('kick',  0,    24000, 2000),  // beat 1
        ...seq('kick',  1000, 24000, 2000),  // beat 3
        ...Array.from({length:12}, (_, b) => ({note:'kick', t: b*2000 + 750})), // "and of 2" — the signature bounce
        ...seq('snare', 500,  24000, 1000),  // beats 2+4
        ...seq('hihat', 250,  24000, 500),   // 8th-note off-beats
        {note:'cymbal',t:0},{note:'cymbal',t:8000},{note:'cymbal',t:16000},
        {note:'clap',t:4000},{note:'clap',t:12000},{note:'clap',t:20000},
      ]},
      { inst: 'bass', events: [
        // F minor walking bass: F→C→D#→C / A#→F→C→F (2-bar loop × 6)
        ...Array.from({length:6}, (_, r) => [
          {note:'F3', t:r*4000+0},    {note:'C3',  t:r*4000+500},
          {note:'D#3',t:r*4000+1000}, {note:'C3',  t:r*4000+1500},
          {note:'A#3',t:r*4000+2000}, {note:'F3',  t:r*4000+2500},
          {note:'C3', t:r*4000+3000}, {note:'F3',  t:r*4000+3500},
        ]).flat(),
      ]},
      { inst: 'piano', events: [
        // Pig Step-inspired 2-bar riff: syncopated, jazzy, chromatic ♭9 crunch on bar 2
        ...Array.from({length:6}, (_, r) => [
          // Bar 1: ascending bounce F→G#→A#→C5→A#→G#→F→D#→C
          {note:'F4', t:r*4000+0},
          {note:'G#4',t:r*4000+250},
          {note:'A#4',t:r*4000+500},
          {note:'C5', t:r*4000+625},
          {note:'A#4',t:r*4000+750},
          {note:'G#4',t:r*4000+1000},
          {note:'F4', t:r*4000+1250},
          {note:'D#4',t:r*4000+1500},
          {note:'C4', t:r*4000+1750},
          // Bar 2: chromatic ♭9 crunch — C#5 bends into C5 (the Pig Step spice)
          {note:'F4', t:r*4000+2000},
          {note:'G#4',t:r*4000+2250},
          {note:'C5', t:r*4000+2500},
          {note:'C#5',t:r*4000+2625},
          {note:'C5', t:r*4000+2750},
          {note:'A#4',t:r*4000+3000},
          {note:'G#4',t:r*4000+3250},
          {note:'F4', t:r*4000+3500},
          {note:'D#4',t:r*4000+3750},
        ]).flat(),
      ]},
      { inst: 'pad', events: [
        // Fm7 → A#m → G# → D# — warm chord wash, one chord per 6s
        {note:'F3', t:0},    {note:'G#3',t:80},  {note:'C4', t:160}, {note:'D#4',t:240},
        {note:'A#3',t:6000}, {note:'C#4',t:6080},{note:'F4', t:6160},
        {note:'G#3',t:12000},{note:'C4', t:12080},{note:'D#4',t:12160},
        {note:'D#3',t:18000},{note:'G3', t:18080},{note:'A#3',t:18160},
      ]},
      { inst: 'pluck', events: [
        // Vibraphone-style counter-melody — enters at 8s (bar 5), builds through end
        {note:'F4',t:8000},{note:'G#4',t:8500},{note:'C5',t:9000},{note:'A#4',t:9500},
        {note:'F4',t:10000},{note:'D#4',t:10500},{note:'C4',t:11000},{note:'D#4',t:11500},
        {note:'F4',t:16000},{note:'G#4',t:16500},{note:'C5',t:17000},{note:'A#4',t:17500},
        {note:'G#4',t:18000},{note:'F4',t:18500},{note:'D#4',t:19000},{note:'F4',t:19500},
        {note:'F4',t:20000},{note:'C5',t:20250},{note:'A#4',t:20500},{note:'G#4',t:20750},
        {note:'F4',t:21000},{note:'D#4',t:21250},{note:'C4',t:21500},{note:'D#4',t:21750},
        {note:'F4',t:22000},{note:'G#4',t:22250},{note:'C5',t:22500},{note:'C#5',t:22625},
        {note:'C5',t:22750},{note:'A#4',t:23000},{note:'G#4',t:23250},{note:'F4',t:23500},
      ]},
      { inst: 'basetone', events: [
        // Sub-bass pedal tones (plays one octave below): F→F→A#→G# root anchors
        {note:'F3',t:0},{note:'F3',t:6000},{note:'A#3',t:12000},{note:'G#3',t:18000},
      ]},
    ],
  },
  */

  /* NEON SOUL — commented out
  {
    // 100 BPM, A minor — neo-soul piano over a groove kit, warm chord pads
    // beat=600, 8th=300, bar=2400, 10 bars=24s
    name: 'NEON SOUL', emoji: '✨',
    desc: 'Warm neo-soul with piano melody and pads · A minor · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,    24000, 2400),  // beat 1
        ...seq('kick',  900,  24000, 2400),  // "and of 2" syncopation
        ...seq('kick',  1200, 24000, 2400),  // beat 3
        ...seq('snare', 600,  24000, 1200),  // beats 2+4
        ...seq('hihat', 300,  24000, 600),   // 8th off-beats
        {note:'cymbal',t:0},{note:'cymbal',t:12000},
        {note:'clap',t:4800},{note:'clap',t:9600},{note:'clap',t:19200},
      ]},
      { inst: 'bass', events: [
        // A minor walking bass: A→E→G→A feel
        {note:'A3',t:0},{note:'E3',t:600},{note:'G3',t:1200},{note:'A3',t:1800},
        {note:'C4',t:2400},{note:'A3',t:3000},{note:'E3',t:3600},{note:'G3',t:4200},
        {note:'A3',t:4800},{note:'E3',t:5400},{note:'G3',t:6000},{note:'A3',t:6600},
        {note:'D4',t:7200},{note:'A3',t:7800},{note:'E3',t:8400},{note:'G3',t:9000},
        {note:'A3',t:9600},{note:'E3',t:10200},{note:'C4',t:10800},{note:'A3',t:11400},
        {note:'A3',t:12000},{note:'G3',t:12600},{note:'E3',t:13200},{note:'A3',t:13800},
        {note:'F3',t:14400},{note:'A3',t:15000},{note:'E3',t:15600},{note:'G3',t:16200},
        {note:'A3',t:16800},{note:'E3',t:17400},{note:'G3',t:18000},{note:'A3',t:18600},
        {note:'A3',t:19200},{note:'C4',t:19800},{note:'E4',t:20400},{note:'A3',t:21000},
        {note:'G3',t:21600},{note:'E3',t:22200},{note:'A3',t:22800},{note:'A3',t:23400},
      ]},
      { inst: 'piano', events: [
        // Neo-soul piano: Am pentatonic (A C D E G), enters bar 3
        // Phrase 1 (4800-9600): call
        {note:'A4',t:4800},{note:'G4',t:5100},{note:'E4',t:5400},{note:'D4',t:5700},
        {note:'E4',t:6000},{note:'G4',t:6300},{note:'A4',t:6600},{note:'G4',t:6900},
        {note:'E4',t:7200},{note:'D4',t:7500},{note:'C4',t:7800},{note:'A3',t:8100},
        {note:'C4',t:8400},{note:'E4',t:8700},{note:'G4',t:9000},{note:'A4',t:9300},
        // Phrase 2 (9600-14400): response, more syncopated
        {note:'A4',t:9600},{note:'G4',t:9900},{note:'E4',t:10500},{note:'D4',t:10800},
        {note:'E4',t:11100},{note:'G4',t:11400},{note:'A4',t:11700},
        {note:'C5',t:12000},{note:'A4',t:12300},{note:'G4',t:12600},{note:'E4',t:12900},
        {note:'D4',t:13200},{note:'E4',t:13800},{note:'G4',t:14100},
        // Phrase 3 (14400-19200): builds higher
        {note:'A4',t:14400},{note:'C5',t:14700},{note:'A4',t:15000},{note:'G4',t:15300},
        {note:'E4',t:15600},{note:'G4',t:16200},{note:'A4',t:16800},{note:'G4',t:17100},
        {note:'E4',t:17400},{note:'D4',t:17700},{note:'C4',t:18000},{note:'A3',t:18300},
        {note:'C4',t:18600},{note:'E4',t:18900},
        // Outro (19200-24000): resolve
        {note:'A4',t:19200},{note:'G4',t:19500},{note:'E4',t:20100},{note:'C4',t:20700},
        {note:'A3',t:21000},{note:'C4',t:21600},{note:'E4',t:22200},{note:'A4',t:22800},
        {note:'G4',t:23100},{note:'E4',t:23400},{note:'A3',t:23700},
      ]},
      { inst: 'pad', events: [
        {note:'A3',t:0},{note:'C4',t:80},{note:'E4',t:160},    // Am
        {note:'D3',t:7200},{note:'F3',t:7280},{note:'A3',t:7360}, // Dm
        {note:'E3',t:14400},{note:'G#3',t:14480},{note:'B3',t:14560}, // E (dominant)
        {note:'A3',t:19200},{note:'C4',t:19280},{note:'E4',t:19360}, // Am resolve
      ]},
    ],
  },
  */

  /* MIDNIGHT FUNK — commented out
  {
    // 100 BPM, E minor — funk with organ stabs and guitar riff, classic feel
    // beat=600, 8th=300, bar=2400, 10 bars=24s
    name: 'MIDNIGHT FUNK', emoji: '🌙',
    desc: 'Funk groove with organ stabs and guitar · E minor · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,    24000, 1200),  // beats 1+3
        ...seq('snare', 600,  24000, 1200),  // beats 2+4
        ...seq('hihat', 300,  24000, 600),   // 8th notes
        ...seq('hihat', 900,  6000,  1200),  // intro: add extra open hats
        {note:'cymbal',t:0},{note:'cymbal',t:12000},
        {note:'tom',t:2100},{note:'tom',t:4500},{note:'tom',t:11700},
        {note:'clap',t:3600},{note:'clap',t:8400},{note:'clap',t:20400},
      ]},
      { inst: 'bass', events: [
        // E minor funk: slap bass feel — E→B→D pattern
        {note:'E3',t:0},{note:'B3',t:300},{note:'E3',t:600},{note:'G3',t:900},
        {note:'B3',t:1200},{note:'D4',t:1500},{note:'B3',t:1800},{note:'G3',t:2100},
        {note:'E3',t:2400},{note:'B3',t:2700},{note:'D4',t:3000},{note:'G3',t:3600},
        {note:'B3',t:4200},{note:'E3',t:4800},{note:'B3',t:5100},{note:'E3',t:5400},
        {note:'G3',t:5700},{note:'B3',t:6000},{note:'D4',t:6300},{note:'B3',t:6900},
        {note:'G3',t:7200},{note:'E3',t:7800},{note:'B3',t:8400},{note:'E3',t:9000},
        {note:'A3',t:9600},{note:'E3',t:10200},{note:'B3',t:10800},{note:'E3',t:11400},
        {note:'E3',t:12000},{note:'B3',t:12300},{note:'E3',t:12600},{note:'G3',t:12900},
        {note:'B3',t:13200},{note:'D4',t:13500},{note:'B3',t:14100},{note:'G3',t:14400},
        {note:'E3',t:15000},{note:'B3',t:15600},{note:'D4',t:16200},{note:'B3',t:16800},
        {note:'E3',t:17400},{note:'G3',t:18000},{note:'B3',t:18600},{note:'E3',t:19200},
        {note:'A3',t:19800},{note:'B3',t:20400},{note:'E3',t:21000},{note:'G3',t:21600},
        {note:'B3',t:22200},{note:'E3',t:22800},{note:'B3',t:23100},{note:'E3',t:23400},
      ]},
      { inst: 'guitar', events: [
        // Em funk riff: single-note lines with rhythm punch
        {note:'E4',t:0},{note:'G4',t:300},{note:'B4',t:600},{note:'G4',t:900},
        {note:'E4',t:1200},{note:'D4',t:1500},{note:'E4',t:1800},{note:'G4',t:2100},
        {note:'B4',t:2400},{note:'G4',t:2700},{note:'A4',t:3000},{note:'G4',t:3300},
        {note:'E4',t:3600},{note:'D4',t:3900},{note:'E4',t:4800},{note:'G4',t:5100},
        {note:'B4',t:5400},{note:'D4',t:5700},{note:'E4',t:6000},{note:'G4',t:6600},
        {note:'B4',t:7200},{note:'A4',t:7500},{note:'G4',t:7800},{note:'E4',t:8100},
        {note:'D4',t:8400},{note:'E4',t:9000},{note:'G4',t:9600},{note:'B4',t:10200},
        {note:'G4',t:10800},{note:'E4',t:11100},{note:'G4',t:12000},{note:'B4',t:12600},
        {note:'A4',t:13200},{note:'G4',t:13800},{note:'E4',t:14400},{note:'D4',t:15000},
        {note:'E4',t:15600},{note:'G4',t:16200},{note:'B4',t:16800},{note:'A4',t:17400},
        {note:'G4',t:18000},{note:'F#4',t:18600},{note:'E4',t:19200},{note:'G4',t:19800},
        {note:'B4',t:20400},{note:'A4',t:20700},{note:'G4',t:21000},{note:'E4',t:21600},
        {note:'D4',t:22200},{note:'B3',t:22800},{note:'E4',t:23400},
      ]},
      { inst: 'organ', events: [
        // Organ stabs: punchy chord hits on off-beats (Em, Am, Bm feel)
        {note:'E3',t:1800},{note:'G3',t:1900},{note:'B3',t:2000},
        {note:'E3',t:4200},{note:'G3',t:4300},{note:'B3',t:4400},
        {note:'A3',t:6000},{note:'C4',t:6100},{note:'E4',t:6200},
        {note:'E3',t:8400},{note:'G3',t:8500},{note:'B3',t:8600},
        {note:'B3',t:10800},{note:'D4',t:10900},{note:'F#4',t:11000},
        {note:'E3',t:13200},{note:'G3',t:13300},{note:'B3',t:13400},
        {note:'A3',t:15600},{note:'C4',t:15700},{note:'E4',t:15800},
        {note:'E3',t:18000},{note:'G3',t:18100},{note:'B3',t:18200},
        {note:'B3',t:20400},{note:'D4',t:20500},{note:'F#4',t:20600},
        {note:'E3',t:22800},{note:'G3',t:22900},{note:'B3',t:23000},
      ]},
    ],
  },
  */

  {
    // 120 BPM, G major — bright pop synth, pentatonic melody, pluck lead
    // beat=500, 8th=250, bar=2000, 12 bars=24s
    name: 'PACKET BOUNCE', emoji: '📡',
    desc: 'Bright synth-pop with a bouncy pluck lead · G major · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,    24000, 2000),  // beat 1 + 3
        ...seq('kick',  1000, 24000, 2000),
        ...seq('snare', 500,  24000, 1000),  // beats 2+4
        ...seq('hihat', 0,    24000, 250),   // 16th-note hihats (driving!)
        {note:'cymbal',t:0},{note:'cymbal',t:8000},{note:'cymbal',t:16000},
        {note:'clap',t:3500},{note:'clap',t:7500},{note:'clap',t:11500},{note:'clap',t:15500},
        {note:'clap',t:19500},{note:'clap',t:23500},
      ]},
      { inst: 'bass', events: [
        // G major bass: G→D→B pattern, 1 bar loop × 12
        ...Array.from({length:12},(_,i)=>[
          {note:'G3',t:i*2000+0},{note:'D4',t:i*2000+500},
          {note:'G3',t:i*2000+1000},{note:'B3',t:i*2000+1500},
        ]).flat(),
      ]},
      { inst: 'pluck', events: [
        // G pentatonic (G A B D E) melody — bright and melodic
        // Hook bar 1-2: G A B D B A G
        {note:'G4',t:0},{note:'A4',t:250},{note:'B4',t:500},{note:'D4',t:1000},
        {note:'B4',t:1250},{note:'A4',t:1500},{note:'G4',t:1750},
        {note:'D4',t:2000},{note:'G4',t:2250},{note:'A4',t:2500},{note:'B4',t:2750},
        {note:'A4',t:3000},{note:'G4',t:3250},{note:'D4',t:3500},{note:'G4',t:3750},
        // repeat
        {note:'G4',t:4000},{note:'A4',t:4250},{note:'B4',t:4500},{note:'D4',t:5000},
        {note:'B4',t:5250},{note:'A4',t:5500},{note:'G4',t:5750},
        {note:'D4',t:6000},{note:'G4',t:6250},{note:'A4',t:6500},{note:'B4',t:6750},
        {note:'A4',t:7000},{note:'G4',t:7250},{note:'D4',t:7500},{note:'G4',t:7750},
        // B section (8000-16000): higher range
        {note:'B4',t:8000},{note:'D4',t:8250},{note:'G4',t:8500},{note:'A4',t:8750},
        {note:'B4',t:9000},{note:'A4',t:9250},{note:'G4',t:9500},{note:'E4',t:9750},
        {note:'D4',t:10000},{note:'G4',t:10250},{note:'A4',t:10500},{note:'B4',t:10750},
        {note:'A4',t:11000},{note:'G4',t:11250},{note:'E4',t:11500},{note:'D4',t:11750},
        {note:'G4',t:12000},{note:'B4',t:12250},{note:'D4',t:12500},{note:'G4',t:12750},
        {note:'E4',t:13000},{note:'G4',t:13250},{note:'A4',t:13500},{note:'B4',t:13750},
        {note:'A4',t:14000},{note:'G4',t:14250},{note:'E4',t:14500},{note:'D4',t:14750},
        {note:'G4',t:15000},{note:'A4',t:15250},{note:'B4',t:15500},{note:'G4',t:15750},
        // Final section (16000-24000): reprise of hook + tag
        {note:'G4',t:16000},{note:'A4',t:16250},{note:'B4',t:16500},{note:'D4',t:17000},
        {note:'B4',t:17250},{note:'A4',t:17500},{note:'G4',t:17750},
        {note:'D4',t:18000},{note:'G4',t:18250},{note:'A4',t:18500},{note:'B4',t:18750},
        {note:'A4',t:19000},{note:'G4',t:19250},{note:'D4',t:19500},{note:'G4',t:19750},
        {note:'G4',t:20000},{note:'B4',t:20250},{note:'D4',t:20500},{note:'G4',t:20750},
        {note:'B4',t:21000},{note:'A4',t:21250},{note:'G4',t:21500},{note:'E4',t:21750},
        {note:'D4',t:22000},{note:'G4',t:22500},{note:'B4',t:23000},{note:'G4',t:23500},
      ]},
      { inst: 'synth', events: [
        // Synth pad chords, enter bar 5
        {note:'G3',t:8000},{note:'B3',t:8100},{note:'D4',t:8200},   // G major
        {note:'A3',t:12000},{note:'C4',t:12100},{note:'E4',t:12200}, // Am
        {note:'D3',t:16000},{note:'F#3',t:16100},{note:'A3',t:16200}, // D major
        {note:'G3',t:20000},{note:'B3',t:20100},{note:'D4',t:20200}, // G resolve
      ]},
    ],
  },

  {
    // 80 BPM, D minor — lo-fi hip-hop aesthetic: lazy swing, warm piano
    // beat=750, 8th=375, bar=3000, 8 bars=24s
    name: 'LO-FI ROOT', emoji: '🌿',
    desc: 'Slow lo-fi hip-hop with lazy piano swing · D minor · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,    24000, 3000),  // beat 1
        ...seq('kick',  1500, 24000, 3000),  // beat 3
        ...seq('kick',  1125, 24000, 3000),  // "and of 2" lazy bounce
        ...seq('snare', 750,  24000, 1500),  // beats 2+4
        ...seq('hihat', 375,  24000, 750),   // 8th off-beats
        {note:'cymbal',t:0},{note:'cymbal',t:12000},
        {note:'clap',t:6750},{note:'clap',t:13500},{note:'clap',t:21000},
      ]},
      { inst: 'bass', events: [
        // D minor bass: D→A→C pattern, lazy feel
        {note:'D3',t:0},{note:'A3',t:750},{note:'C4',t:1500},{note:'A3',t:2250},
        {note:'G3',t:3000},{note:'D3',t:3750},{note:'F3',t:4500},{note:'D3',t:5250},
        {note:'A3',t:6000},{note:'D3',t:6750},{note:'C4',t:7500},{note:'A3',t:8250},
        {note:'D3',t:9000},{note:'A3',t:9750},{note:'G3',t:10500},{note:'D3',t:11250},
        {note:'C3',t:12000},{note:'G3',t:12750},{note:'C4',t:13500},{note:'G3',t:14250},
        {note:'A3',t:15000},{note:'E3',t:15750},{note:'A3',t:16500},{note:'C4',t:17250},
        {note:'D3',t:18000},{note:'A3',t:18750},{note:'F3',t:19500},{note:'D3',t:20250},
        {note:'A3',t:21000},{note:'C4',t:21750},{note:'D3',t:22500},{note:'A3',t:23250},
      ]},
      { inst: 'piano', events: [
        // Lo-fi piano: D minor pentatonic (D F G A C), laid-back phrasing
        {note:'D4',t:0},{note:'F4',t:750},{note:'A4',t:1125},{note:'G4',t:1500},
        {note:'F4',t:1875},{note:'D4',t:2250},{note:'C4',t:2625},
        {note:'D4',t:3000},{note:'A4',t:3375},{note:'F4',t:3750},{note:'G4',t:4500},
        {note:'A4',t:4875},{note:'G4',t:5250},{note:'F4',t:5625},{note:'D4',t:6000},
        {note:'C4',t:6375},{note:'D4',t:6750},{note:'F4',t:7500},{note:'A4',t:7875},
        {note:'G4',t:8250},{note:'F4',t:8625},{note:'D4',t:9000},
        {note:'A4',t:9375},{note:'C5',t:9750},{note:'A4',t:10125},{note:'G4',t:10500},
        {note:'F4',t:10875},{note:'D4',t:11250},{note:'C4',t:11625},
        {note:'D4',t:12000},{note:'F4',t:12375},{note:'G4',t:12750},{note:'A4',t:13125},
        {note:'C5',t:13500},{note:'A4',t:13875},{note:'G4',t:14250},{note:'F4',t:14625},
        {note:'D4',t:15000},{note:'C4',t:15750},{note:'D4',t:16500},{note:'F4',t:16875},
        {note:'A4',t:17250},{note:'G4',t:17625},{note:'F4',t:18000},{note:'D4',t:18750},
        {note:'A4',t:19125},{note:'F4',t:19500},{note:'G4',t:19875},{note:'A4',t:20250},
        {note:'C5',t:20625},{note:'A4',t:21000},{note:'G4',t:21375},{note:'F4',t:21750},
        {note:'D4',t:22125},{note:'C4',t:22500},{note:'D4',t:23250},
      ]},
      { inst: 'strings', events: [
        {note:'D3',t:0},{note:'F3',t:150},{note:'A3',t:300},    // Dm
        {note:'C3',t:9000},{note:'E3',t:9150},{note:'G3',t:9300}, // C major
        {note:'A3',t:15000},{note:'C4',t:15150},{note:'E4',t:15300}, // Am
        {note:'D3',t:21000},{note:'F3',t:21150},{note:'A3',t:21300}, // Dm resolve
      ]},
    ],
  },

  /* ACID STACK — commented out
  {
    // 120 BPM, F minor — hypnotic acid synth line, 4-on-floor techno energy
    // beat=500, 8th=250, bar=2000, 12 bars=24s
    name: 'ACID STACK', emoji: '🧪',
    desc: 'Acid techno with a driving 303 bassline · F minor · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,    24000, 500),   // 4-on-the-floor
        ...seq('snare', 1000, 24000, 2000),  // only beat 3
        ...seq('clap',  500,  24000, 2000),  // only beat 2
        ...seq('hihat', 250,  24000, 500),   // 8th off-beats
        ...seq('hihat', 125,  16000, 250),   // 16th hihats in first 2/3
        {note:'cymbal',t:0},{note:'cymbal',t:8000},{note:'cymbal',t:16000},{note:'cymbal',t:20000},
        {note:'tom',t:7750},{note:'tom',t:11750},{note:'tom',t:15750},{note:'tom',t:23750},
      ]},
      { inst: 'bass', events: [
        // Acid bass: F minor, repeating hypnotic pattern with octave jumps
        ...Array.from({length:6},(_,i)=>[
          {note:'F3',t:i*4000+0},{note:'F3',t:i*4000+250},{note:'C4',t:i*4000+500},
          {note:'D#3',t:i*4000+750},{note:'F3',t:i*4000+1000},{note:'G#3',t:i*4000+1250},
          {note:'F3',t:i*4000+1500},{note:'C4',t:i*4000+1750},
          {note:'F3',t:i*4000+2000},{note:'G3',t:i*4000+2250},{note:'G#3',t:i*4000+2500},
          {note:'F3',t:i*4000+2750},{note:'D#3',t:i*4000+3000},{note:'F3',t:i*4000+3250},
          {note:'C4',t:i*4000+3500},{note:'F3',t:i*4000+3750},
        ]).flat(),
      ]},
      { inst: 'synth', events: [
        // Acid synth riff: slides and repeated notes (303 vibe)
        {note:'F4',t:0},{note:'F4',t:250},{note:'C5',t:500},{note:'A#4',t:750},
        {note:'G#4',t:1000},{note:'F4',t:1250},{note:'G4',t:1500},{note:'G#4',t:1750},
        {note:'F4',t:2000},{note:'F4',t:2250},{note:'D#4',t:2500},{note:'F4',t:2750},
        {note:'G#4',t:3000},{note:'F4',t:3250},{note:'D#4',t:3500},{note:'C4',t:3750},
        // repeat × 5 with small variation
        ...Array.from({length:5},(_,i)=>[
          {note:'F4',t:(i+1)*4000+0},{note:'F4',t:(i+1)*4000+250},{note:'C5',t:(i+1)*4000+500},{note:'A#4',t:(i+1)*4000+750},
          {note:'G#4',t:(i+1)*4000+1000},{note:'F4',t:(i+1)*4000+1250},{note:'G4',t:(i+1)*4000+1500},{note:'G#4',t:(i+1)*4000+1750},
          {note:'F4',t:(i+1)*4000+2000},{note:'F4',t:(i+1)*4000+2250},{note:'D#4',t:(i+1)*4000+2500},{note:'C5',t:(i+1)*4000+2750},
          {note:'G#4',t:(i+1)*4000+3000},{note:'F4',t:(i+1)*4000+3250},{note:'C4',t:(i+1)*4000+3500},{note:'F4',t:(i+1)*4000+3750},
        ]).flat(),
      ]},
      { inst: 'pad', events: [
        {note:'F3',t:0},{note:'G#3',t:100},{note:'C4',t:200},
        {note:'D#3',t:8000},{note:'G3',t:8100},{note:'A#3',t:8200},
        {note:'F3',t:16000},{note:'G#3',t:16100},{note:'C4',t:16200},
        {note:'C4',t:20000},{note:'D#4',t:20100},{note:'G4',t:20200},
      ]},
    ],
  },
  */

  /* JAZZ KERNEL — commented out
  {
    // 100 BPM, G major — jazz swing with piano chords, walking bass, ride cymbal feel
    // beat=600, 8th=300 (swing: long-short 400/200), bar=2400, 10 bars=24s
    name: 'JAZZ KERNEL', emoji: '🎷',
    desc: 'Jazz swing with piano and walking bass · G major · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Ride cymbal feel: every beat + "and" (swing)
        ...seq('cymbal', 0,   24000, 600),   // every beat
        ...seq('cymbal', 400, 24000, 600),   // swung 8th after (long-short)
        ...seq('snare',  600, 24000, 2400),  // beat 2 only (light jazz snare)
        ...seq('kick',   0,   24000, 2400),  // beat 1 (light)
        {note:'kick',t:1200},{note:'kick',t:3600},{note:'kick',t:6000}, // sparse walking kicks
        {note:'kick',t:9600},{note:'kick',t:14400},{note:'kick',t:19200},
        {note:'hihat',t:1200},{note:'hihat',t:3600},{note:'hihat',t:6000}, // HH on 2+4
        {note:'hihat',t:7800},{note:'hihat',t:10200},{note:'hihat',t:12600},
        {note:'hihat',t:15000},{note:'hihat',t:17400},{note:'hihat',t:19800},{note:'hihat',t:22200},
      ]},
      { inst: 'bass', events: [
        // Walking jazz bass: G B D F# / E A D G / C G A D (ii-V-I feel)
        {note:'G3',t:0},{note:'B3',t:600},{note:'D4',t:1200},{note:'F#3',t:1800},
        {note:'E3',t:2400},{note:'G3',t:3000},{note:'B3',t:3600},{note:'D4',t:4200},
        {note:'A3',t:4800},{note:'C4',t:5400},{note:'E4',t:6000},{note:'G3',t:6600},
        {note:'D3',t:7200},{note:'F#3',t:7800},{note:'A3',t:8400},{note:'C4',t:9000},
        {note:'G3',t:9600},{note:'B3',t:10200},{note:'D4',t:10800},{note:'F#3',t:11400},
        {note:'E3',t:12000},{note:'G3',t:12600},{note:'B3',t:13200},{note:'A3',t:13800},
        {note:'D3',t:14400},{note:'F#3',t:15000},{note:'A3',t:15600},{note:'C4',t:16200},
        {note:'G3',t:16800},{note:'B3',t:17400},{note:'D4',t:18000},{note:'E4',t:18600},
        {note:'A3',t:19200},{note:'C4',t:19800},{note:'E4',t:20400},{note:'G3',t:21000},
        {note:'D3',t:21600},{note:'F#3',t:22200},{note:'G3',t:22800},{note:'B3',t:23400},
      ]},
      { inst: 'piano', events: [
        // Jazz comping: chord stabs on off-beats, G major → Em → Am → D7
        // Sparse and syncopated as real jazz piano
        {note:'G4',t:400},{note:'B4',t:450},{note:'D4',t:500},    // Gmaj
        {note:'E4',t:2200},{note:'G4',t:2250},{note:'B4',t:2300},  // Em
        {note:'A3',t:4300},{note:'C4',t:4350},{note:'E4',t:4400},  // Am
        {note:'D4',t:5800},{note:'F#4',t:5850},{note:'A4',t:5900}, // D7
        {note:'G4',t:7000},{note:'B4',t:7050},{note:'D4',t:7100},  // Gmaj
        {note:'E4',t:9400},{note:'G4',t:9450},{note:'B4',t:9500},  // Em
        {note:'C4',t:11800},{note:'E4',t:11850},{note:'G4',t:11900}, // C maj
        {note:'D4',t:13600},{note:'F#4',t:13650},{note:'A4',t:13700}, // D
        {note:'G4',t:16000},{note:'B4',t:16050},{note:'D4',t:16100},
        {note:'E4',t:18400},{note:'G4',t:18450},{note:'B4',t:18500},
        {note:'A3',t:20200},{note:'C4',t:20250},{note:'E4',t:20300},
        {note:'D4',t:22000},{note:'F#4',t:22050},{note:'A4',t:22100},
        {note:'G4',t:23200},{note:'B4',t:23250},{note:'D4',t:23300},
      ]},
      { inst: 'organ', events: [
        // Subtle organ fills between piano phrases
        {note:'G3',t:1200},{note:'B3',t:1800},
        {note:'A3',t:6000},{note:'E4',t:6300},
        {note:'D4',t:10800},{note:'F#4',t:11100},
        {note:'G4',t:14400},{note:'B4',t:14700},
        {note:'A4',t:19200},{note:'G4',t:19800},
        {note:'G3',t:22800},{note:'D4',t:23100},
      ]},
    ],
  },
  */

  /* GHOST ROOT — commented out
  {
    // 80 BPM, B minor — haunting soprano over dark pads, sparse and cinematic
    // beat=750, 8th=375, bar=3000, 8 bars=24s
    name: 'GHOST ROOT', emoji: '👻',
    desc: 'Ethereal soprano over dark ambient pads · B minor · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Sparse — only deep kicks and cymbal crashes for atmosphere
        {note:'kick',t:0},{note:'kick',t:3000},{note:'kick',t:6000},
        {note:'cymbal',t:0},{note:'cymbal',t:9000},{note:'cymbal',t:18000},
        {note:'tom',t:4500},{note:'tom',t:7500},{note:'tom',t:13500},{note:'tom',t:22500},
      ]},
      { inst: 'basetone', events: [
        // Sub-bass pedal (plays at B1/F#1): spectral depth under the haunting pads
        {note:'B3',t:0},{note:'F#3',t:6000},{note:'G3',t:12000},{note:'D3',t:18000},
      ]},
      { inst: 'bass', events: [
        // Deep, slow Bm bass: B→F#→A→E descend
        {note:'B3',t:0},{note:'F#3',t:1500},{note:'A3',t:3000},{note:'E3',t:4500},
        {note:'B3',t:6000},{note:'F#3',t:7500},{note:'G3',t:9000},{note:'A3',t:10500},
        {note:'B3',t:12000},{note:'F#3',t:13500},{note:'E3',t:15000},{note:'A3',t:16500},
        {note:'D3',t:18000},{note:'A3',t:19500},{note:'F#3',t:21000},{note:'B3',t:22500},
      ]},
      { inst: 'soprano', events: [
        // Soprano "ooh" melody — haunting B minor scale (B C# D E F# G A)
        // Uses notes available: B3 B4, C#=C#3/C#4, D3/D4, E3/E4, F#3/F#4, G3/G4, A3/A4
        {note:'B4',t:0},{note:'A4',t:750},{note:'G4',t:1500},{note:'F#4',t:2250},
        {note:'E4',t:3000},{note:'F#4',t:3750},{note:'G4',t:4500},{note:'A4',t:5250},
        {note:'B4',t:6000},{note:'A4',t:6750},{note:'F#4',t:7500},{note:'E4',t:8250},
        {note:'D4',t:9000},{note:'E4',t:9750},{note:'F#4',t:10500},{note:'G4',t:11250},
        {note:'A4',t:12000},{note:'B4',t:12750},{note:'A4',t:13500},{note:'G4',t:14250},
        {note:'F#4',t:15000},{note:'E4',t:15750},{note:'D4',t:16500},{note:'E4',t:17250},
        {note:'F#4',t:18000},{note:'G4',t:18750},{note:'A4',t:19500},{note:'B4',t:20250},
        {note:'A4',t:21000},{note:'G4',t:21750},{note:'F#4',t:22500},{note:'B4',t:23250},
      ]},
      { inst: 'pad', events: [
        {note:'B3',t:0},{note:'D4',t:150},{note:'F#4',t:300},    // Bm
        {note:'G3',t:9000},{note:'B3',t:9150},{note:'D4',t:9300}, // G major
        {note:'A3',t:15000},{note:'C#4',t:15150},{note:'E4',t:15300}, // A major
        {note:'B3',t:21000},{note:'D4',t:21150},{note:'F#4',t:21300}, // Bm resolve
      ]},
      { inst: 'strings', events: [
        {note:'B3',t:0},{note:'D4',t:3000},{note:'F#4',t:6000},
        {note:'G3',t:9000},{note:'A3',t:12000},{note:'F#3',t:15000},
        {note:'D3',t:18000},{note:'A3',t:21000},
      ]},
    ],
  },
  */

  {
    // 120 BPM, C major — bright afrobeat with pluck, acoustic guitar, interlocking rhythms
    // beat=500, 8th=250, bar=2000, 12 bars=24s
    name: 'HOT PATCH', emoji: '🔥',
    desc: 'Afrobeat groove with pluck and acoustic · C major · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Afrobeat kit: kick on 1 + "and of 3", snare 2+4, open hihat on off-beats
        ...seq('kick',  0,    24000, 2000),  // beat 1
        ...seq('kick',  1250, 24000, 2000),  // and of 3
        ...seq('snare', 500,  24000, 2000),  // beat 2
        ...seq('snare', 1500, 24000, 2000),  // beat 4
        ...seq('hihat', 250,  24000, 500),   // off-beat 8ths
        ...seq('tom',   750,  24000, 2000),  // interlocking tom
        {note:'cymbal',t:0},{note:'cymbal',t:8000},{note:'cymbal',t:16000},
        {note:'clap',t:4000},{note:'clap',t:8000},{note:'clap',t:12000},
        {note:'clap',t:16000},{note:'clap',t:20000},
      ]},
      { inst: 'bass', events: [
        // C major afrobeat bass: simple root-5th with rhythmic pops
        ...Array.from({length:12},(_,i)=>[
          {note:'C3',t:i*2000+0},{note:'G3',t:i*2000+500},
          {note:'C3',t:i*2000+1000},{note:'E3',t:i*2000+1500},
        ]).flat(),
      ]},
      { inst: 'pluck', events: [
        // Kora-style pluck: C major (C D E G A), interlocking riff
        {note:'C4',t:0},{note:'E4',t:125},{note:'G4',t:250},{note:'A4',t:375},
        {note:'G4',t:500},{note:'E4',t:625},{note:'C4',t:750},{note:'D4',t:875},
        {note:'E4',t:1000},{note:'G4',t:1125},{note:'A4',t:1250},{note:'G4',t:1375},
        {note:'E4',t:1500},{note:'C4',t:1625},{note:'D4',t:1750},{note:'E4',t:1875},
        ...Array.from({length:11},(_,i)=>[
          {note:'C4',t:(i+1)*2000+0},{note:'E4',t:(i+1)*2000+125},
          {note:'G4',t:(i+1)*2000+250},{note:'A4',t:(i+1)*2000+375},
          {note:'G4',t:(i+1)*2000+500},{note:'E4',t:(i+1)*2000+625},
          {note:'C4',t:(i+1)*2000+750},{note:'D4',t:(i+1)*2000+875},
          {note:'E4',t:(i+1)*2000+1000},{note:'G4',t:(i+1)*2000+1125},
          {note:'A4',t:(i+1)*2000+1250},{note:'G4',t:(i+1)*2000+1375},
          {note:'E4',t:(i+1)*2000+1500},{note:'C4',t:(i+1)*2000+1625},
          {note:'D4',t:(i+1)*2000+1750},{note:'E4',t:(i+1)*2000+1875},
        ]).flat(),
      ]},
      { inst: 'acoustic', events: [
        // Acoustic rhythm guitar: strums on off-beats (off-beat is the afrobeat signature)
        ...seq('E4', 250, 24000, 500),  // E chord stabs on off-beats
      ]},
    ],
  },

  {
    // 100 BPM, D minor — dark synthwave, pulsing bass, strings drama
    // beat=600, 8th=300, bar=2400, 10 bars=24s
    name: 'PRIVILEGE ESC', emoji: '🔑',
    desc: 'Synthwave arpeggios with cinematic strings · D minor · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        ...seq('kick',  0,    24000, 1200),  // beats 1+3
        ...seq('snare', 600,  24000, 1200),  // beats 2+4
        ...seq('hihat', 0,    24000, 300),   // 8th notes
        ...seq('clap',  600,  24000, 1200),  // doubles snare
        {note:'cymbal',t:0},{note:'cymbal',t:12000},
        {note:'tom',t:2100},{note:'tom',t:9900},{note:'tom',t:14100},{note:'tom',t:21900},
      ]},
      { inst: 'bass', events: [
        // Dm synthwave arpeggio bass (pulsing 8th notes, root-octave-5th)
        ...Array.from({length:10},(_,i)=>[
          {note:'D3',t:i*2400+0},{note:'D3',t:i*2400+300},
          {note:'A3',t:i*2400+600},{note:'D3',t:i*2400+900},
          {note:'F3',t:i*2400+1200},{note:'D3',t:i*2400+1500},
          {note:'A3',t:i*2400+1800},{note:'D3',t:i*2400+2100},
        ]).flat(),
      ]},
      { inst: 'synth', events: [
        // Synthwave lead: Dm descending then Fm, Am, Em - classic retrowave melody
        {note:'D4',t:0},{note:'C4',t:300},{note:'A#3',t:600},{note:'A3',t:900},
        {note:'F3',t:1200},{note:'A3',t:1500},{note:'C4',t:1800},{note:'D4',t:2100},
        {note:'F4',t:2400},{note:'E4',t:2700},{note:'D4',t:3000},{note:'C4',t:3300},
        {note:'A3',t:3600},{note:'A#3',t:3900},{note:'A3',t:4200},{note:'G3',t:4500},
        // Build (bar 3-5)
        {note:'F4',t:4800},{note:'G4',t:5100},{note:'A4',t:5400},{note:'A#4',t:5700},
        {note:'A4',t:6000},{note:'G4',t:6300},{note:'F4',t:6600},{note:'D4',t:6900},
        {note:'E4',t:7200},{note:'G4',t:7500},{note:'A4',t:7800},{note:'G4',t:8100},
        {note:'F4',t:8400},{note:'E4',t:8700},{note:'D4',t:9000},{note:'C4',t:9300},
        // Full lead (bar 6-8)
        {note:'D4',t:9600},{note:'F4',t:9900},{note:'A4',t:10200},{note:'C5',t:10500},
        {note:'A4',t:10800},{note:'F4',t:11100},{note:'D4',t:11400},{note:'C4',t:11700},
        {note:'A#3',t:12000},{note:'D4',t:12300},{note:'F4',t:12600},{note:'A4',t:12900},
        {note:'G4',t:13200},{note:'F4',t:13500},{note:'D4',t:13800},{note:'C4',t:14100},
        {note:'D4',t:14400},{note:'F4',t:14700},{note:'A4',t:15000},{note:'C5',t:15300},
        {note:'A#4',t:15600},{note:'A4',t:15900},{note:'G4',t:16200},{note:'F4',t:16500},
        // Climax (bar 9-10)
        {note:'D4',t:16800},{note:'F4',t:17100},{note:'A4',t:17400},{note:'D5',t:17700},
        {note:'C5',t:18000},{note:'A4',t:18300},{note:'F4',t:18600},{note:'D4',t:18900},
        {note:'E4',t:19200},{note:'G4',t:19500},{note:'A4',t:19800},{note:'B4',t:20100},
        {note:'A4',t:20400},{note:'G4',t:20700},{note:'F4',t:21000},{note:'D4',t:21300},
        {note:'A#3',t:21600},{note:'C4',t:21900},{note:'D4',t:22200},{note:'F4',t:22500},
        {note:'A4',t:22800},{note:'D4',t:23100},{note:'A3',t:23400},{note:'D4',t:23700},
      ]},
      { inst: 'strings', events: [
        // Sweeping strings — Dm, Gm, A, Dm i-iv-V-i arc
        {note:'D3',t:0},{note:'F3',t:150},{note:'A3',t:300},
        {note:'G3',t:7200},{note:'A#3',t:7350},{note:'D4',t:7500},
        {note:'A3',t:14400},{note:'C#4',t:14550},{note:'E4',t:14700},
        {note:'D3',t:19200},{note:'F3',t:19350},{note:'A3',t:19500},
        {note:'D3',t:22800},{note:'A3',t:22950},{note:'D4',t:23100},
      ]},
    ],
  },

  /* FULL SEND — commented out
  // ── FULL SEND ─────────────────────────────────────────────────────────────
  {
    name: 'FULL SEND', emoji: '🔥', chorus: true,
    desc: 'Six instruments locked in at full energy · C major · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // VERSE (0–12000ms): kick + hihat only, building tension
        ...seq('kick',  0,    12000, 1000),
        ...seq('hihat', 0,    12000, 500),
        {note:'cymbal',t:0},
        // CHORUS (12000–24000ms): full kit drops hard
        {note:'cymbal',t:12000},
        ...seq('kick',  12000, 24000, 500),
        ...seq('snare', 12250, 24000, 500),
        ...seq('hihat', 12000, 24000, 125),
        {note:'clap',t:15500},{note:'clap',t:19500},{note:'clap',t:23500},
      ]},
      { inst: 'bass', events: [
        // VERSE (0–12000ms): steady root walk C–E–G
        ...Array.from({length:4}, (_,r) => [
          {note:'C3',t:r*3000+0},{note:'E3',t:r*3000+1000},{note:'G3',t:r*3000+2000},
        ]).flat(),
        // CHORUS (12000–24000ms): tighter A2 walk, double-time feel
        ...Array.from({length:8}, (_,r) => [
          {note:'C3',t:12000+r*1500+0},{note:'E3',t:12000+r*1500+300},
          {note:'G3',t:12000+r*1500+600},{note:'A3',t:12000+r*1500+900},
        ]).flat(),
      ]},
      { inst: 'piano', events: [
        // VERSE (0–12000ms): sparse C major chord every 2000ms
        {note:'C4',t:0},{note:'E4',t:80},{note:'G4',t:160},
        {note:'C4',t:2000},{note:'E4',t:2080},{note:'G4',t:2160},
        {note:'F3',t:4000},{note:'A3',t:4080},{note:'C4',t:4160},
        {note:'G3',t:6000},{note:'B3',t:6080},{note:'D4',t:6160},
        {note:'C4',t:8000},{note:'E4',t:8080},{note:'G4',t:8160},
        {note:'F3',t:10000},{note:'A3',t:10080},{note:'C4',t:10160},
        // CHORUS (12000–24000ms): punchy offbeat stabs every 250ms
        ...Array.from({length:48}, (_,i) => [
          {note:'C4',t:12000+i*250+0},{note:'E4',t:12000+i*250+30},{note:'G4',t:12000+i*250+60},
        ]).flat(),
      ]},
      { inst: 'synth', events: [
        // VERSE (0–12000ms): slow pentatonic melody, one note per beat
        {note:'G4',t:0},{note:'A4',t:1000},{note:'C5',t:2000},{note:'A4',t:3000},
        {note:'G4',t:4000},{note:'E4',t:5000},{note:'G4',t:6000},{note:'C5',t:7000},
        {note:'B4',t:8000},{note:'A4',t:9000},{note:'G4',t:10000},{note:'E4',t:11000},
        // CHORUS (12000–24000ms): fast C major run every 250ms — the hook
        ...Array.from({length:24}, (_,r) => [
          {note:'C4',t:12000+r*500+0},{note:'E4',t:12000+r*500+125},
          {note:'G4',t:12000+r*500+250},{note:'A4',t:12000+r*500+375},
        ]).flat(),
      ]},
      { inst: 'guitar', events: [
        // CHORUS only (12000–24000ms): power chord stab every 500ms
        ...Array.from({length:24}, (_,i) => [
          {note:'A#3',t:12000+i*500+0},{note:'F4',t:12000+i*500+30},
        ]).flat(),
      ]},
      { inst: 'pad', events: [
        // CHORUS only: C major wash enters with the drop
        {note:'C3',t:12000},{note:'G3',t:12200},{note:'E3',t:12400},
      ]},
    ],
  },
  */

  // ── MIDNIGHT JAZZ ─────────────────────────────────────────────────────────
  {
    name: 'MIDNIGHT JAZZ', emoji: '🎷', chorus: true,
    desc: 'Rich jazz ensemble with lush voicings · Bb major · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // VERSE (0–12000ms): ride only + kick on beat 1, cool and sparse
        ...seq('cymbal', 0, 12000, 600),
        ...seq('kick', 0, 12000, 2400),
        // CHORUS (12000–24000ms): full jazz kit — ride tightens, snare 2+4
        ...seq('cymbal', 12000, 24000, 300),
        ...seq('kick',   12000, 24000, 2400),
        ...seq('snare',  12600, 24000, 1200),
        ...seq('hihat',  12300, 24000, 600),
      ]},
      { inst: 'bass', events: [
        // VERSE (0–12000ms): simple Bb–F root movement
        ...Array.from({length:5}, (_,r) => [
          {note:'A#2',t:r*2400+0},{note:'F2',t:r*2400+1200},
        ]).flat(),
        // CHORUS (12000–24000ms): chromatic walk Bb→C→D→Eb→F
        ...Array.from({length:4}, (_,r) => [
          {note:'A#2',t:12000+r*2400+0},{note:'C3',t:12000+r*2400+300},
          {note:'D3',t:12000+r*2400+600},{note:'D#3',t:12000+r*2400+900},
          {note:'F3',t:12000+r*2400+1200},{note:'D#3',t:12000+r*2400+1500},
          {note:'D3',t:12000+r*2400+1800},{note:'C3',t:12000+r*2400+2100},
        ]).flat(),
      ]},
      { inst: 'piano', events: [
        // VERSE (0–12000ms): sparse Bb maj7 chord every 2400ms
        {note:'A#3',t:0},{note:'D4',t:100},{note:'F4',t:200},
        {note:'D#4',t:2400},{note:'G4',t:2500},{note:'A#4',t:2600},
        {note:'F4',t:4800},{note:'A4',t:4900},{note:'C4',t:5000},
        {note:'A#3',t:7200},{note:'D4',t:7300},{note:'F4',t:7400},
        {note:'D#4',t:9600},{note:'G4',t:9700},{note:'A#4',t:9800},
        // CHORUS (12000–24000ms): every 600ms with added 7ths, more motion
        ...Array.from({length:10}, (_,r) => [
          {note:'A#3',t:12000+r*1200+0},{note:'D4',t:12000+r*1200+60},{note:'F4',t:12000+r*1200+120},{note:'A4',t:12000+r*1200+180},
          {note:'D#4',t:12000+r*1200+600},{note:'G4',t:12000+r*1200+660},{note:'A#4',t:12000+r*1200+720},
        ]).flat(),
      ]},
      { inst: 'strings', events: [
        // CHORUS only (12000–24000ms): long sustained melody enters
        {note:'A#4',t:12000},{note:'A4',t:13200},{note:'G4',t:14400},{note:'F4',t:15600},
        {note:'D4',t:16800},{note:'F4',t:18000},{note:'G4',t:19200},{note:'A4',t:20400},
        {note:'A#4',t:21600},{note:'A4',t:22200},{note:'G4',t:22800},{note:'F4',t:23400},
      ]},
      { inst: 'pluck', events: [
        // CHORUS only (12000–24000ms): pizzicato every 300ms
        ...Array.from({length:40}, (_,i) => ({note:['A#4','G4','F4','D4'][i%4],t:12000+i*300})),
      ]},
      { inst: 'pad', events: [
        // CHORUS only: warm Bb wash enters with the drop
        {note:'A#3',t:12000},{note:'D4',t:12400},{note:'F4',t:12800},
      ]},
    ],
  },

  /* SPACE GOSPEL — commented out
  // ── SPACE GOSPEL ──────────────────────────────────────────────────────────
  {
    name: 'SPACE GOSPEL', emoji: '🌌', chorus: true,
    desc: 'Cosmic gospel with swelling organ and choir · D minor · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // VERSE (0–12000ms): just kick on beat 1 — cavernous, sparse
        ...seq('kick', 0, 12000, 3000),
        {note:'cymbal',t:0},
        // CHORUS (12000–24000ms): full gospel stomp crashes in
        {note:'cymbal',t:12000},
        ...seq('kick',  12000, 24000, 1500),
        ...seq('snare', 12750, 24000, 1500),
        {note:'clap',t:12750},{note:'clap',t:14250},{note:'clap',t:15750},{note:'clap',t:17250},
        {note:'clap',t:18750},{note:'clap',t:20250},{note:'clap',t:21750},{note:'clap',t:23250},
      ]},
      { inst: 'basetone', events: [
        // Sub-bass beneath the gospel: D pedal in verse, rises into chorus
        {note:'D3',t:0},{note:'D3',t:6000},
        {note:'D3',t:12000},{note:'G3',t:15000},{note:'A3',t:18000},{note:'D3',t:21000},
      ]},
      { inst: 'bass', events: [
        // VERSE (0–12000ms): deep D2 pedal, breathes slowly
        {note:'D2',t:0},{note:'A2',t:6000},
        // CHORUS (12000–24000ms): active D2→G2→A2→G2 movement
        ...Array.from({length:4}, (_,r) => [
          {note:'D2',t:12000+r*3000+0},{note:'G2',t:12000+r*3000+750},
          {note:'A2',t:12000+r*3000+1500},{note:'G2',t:12000+r*3000+2250},
        ]).flat(),
      ]},
      { inst: 'organ', events: [
        // VERSE (0–12000ms): long Dm chord every 3000ms
        {note:'D3',t:0},{note:'F3',t:100},{note:'A3',t:200},
        {note:'D3',t:3000},{note:'F3',t:3100},{note:'A3',t:3200},
        {note:'G3',t:6000},{note:'A#3',t:6100},{note:'D4',t:6200},
        {note:'G3',t:9000},{note:'A#3',t:9100},{note:'D4',t:9200},
        // CHORUS (12000–24000ms): chord every 1500ms — fills the room
        {note:'A3',t:12000},{note:'C4',t:12100},{note:'E4',t:12200},
        {note:'D3',t:13500},{note:'F3',t:13600},{note:'A3',t:13700},
        {note:'A3',t:15000},{note:'C4',t:15100},{note:'E4',t:15200},
        {note:'D3',t:16500},{note:'F3',t:16600},{note:'A3',t:16700},
        {note:'G3',t:18000},{note:'A#3',t:18100},{note:'D4',t:18200},
        {note:'D3',t:19500},{note:'F3',t:19600},{note:'A3',t:19700},
        {note:'A3',t:21000},{note:'C4',t:21100},{note:'E4',t:21200},
        {note:'D3',t:22500},{note:'F3',t:22600},{note:'A3',t:22700},
      ]},
      { inst: 'soprano', events: [
        // VERSE (0–12000ms): slow D minor melody, one note per 3000ms
        {note:'D4',t:750},{note:'F4',t:3750},{note:'A4',t:6750},{note:'F4',t:9750},
        // CHORUS (12000–24000ms): holds C5→A4 — the big moment
        {note:'C5',t:12000},{note:'A4',t:15000},{note:'C5',t:18000},{note:'A4',t:21000},
      ]},
      { inst: 'strings', events: [
        // CHORUS only (12000–24000ms): soaring D minor countermelody
        {note:'C5',t:12000},{note:'A4',t:12750},{note:'G4',t:13500},{note:'F4',t:14250},
        {note:'E4',t:15000},{note:'D4',t:15750},{note:'F4',t:16500},{note:'A4',t:17250},
        {note:'A#4',t:18000},{note:'A4',t:18750},{note:'G4',t:19500},{note:'F4',t:20250},
        {note:'E4',t:21000},{note:'F4',t:21750},{note:'A4',t:22500},{note:'D4',t:23250},
      ]},
      { inst: 'synth', events: [
        // CHORUS only (12000–24000ms): fast D4→F4→A4→C5 arpeggio every 375ms
        ...Array.from({length:32}, (_,i) => ({note:(['D4','F4','A4','C5'] as const)[i%4],t:12000+i*375})),
      ]},
    ],
  },
  */

  // ── HACKATHON ─────────────────────────────────────────────────────────────
  {
    name: 'HACKATHON', emoji: '💻', chorus: true,
    desc: 'Full band crunch with synths and electric · A minor · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // VERSE (0–12000ms): hi-hat every 125ms + kick every 1000ms — tense, mechanical
        ...seq('hihat', 0,    12000, 125),
        ...seq('kick',  0,    12000, 1000),
        {note:'cymbal',t:0},
        // CHORUS (12000–24000ms): full kit, clap burst on drop
        {note:'clap',t:12000},
        {note:'cymbal',t:12000},
        ...seq('hihat', 12000, 24000, 125),
        ...seq('kick',  12000, 24000, 500),
        ...seq('snare', 12250, 24000, 500),
      ]},
      { inst: 'bass', events: [
        // VERSE (0–12000ms): A3→E3 alternating (steady, locked in)
        ...Array.from({length:12}, (_,r) => [
          {note:'A3',t:r*1000+0},{note:'E3',t:r*1000+500},
        ]).flat(),
        // CHORUS (12000–24000ms): A2→E3→G3→A2 fast walk every 250ms
        ...Array.from({length:24}, (_,r) => ({note:(['A2','E3','G3','A2'] as const)[r%4],t:12000+r*250})),
      ]},
      { inst: 'synth', events: [
        // VERSE + CHORUS: ostinato runs throughout — the through-line
        ...Array.from({length:8}, (_,r) => [
          {note:'A4',t:r*3000+0},{note:'C5',t:r*3000+250},{note:'E4',t:r*3000+500},
          {note:'G4',t:r*3000+750},{note:'A4',t:r*3000+1000},{note:'C5',t:r*3000+1250},
          {note:'B4',t:r*3000+1500},{note:'A4',t:r*3000+1750},{note:'G4',t:r*3000+2000},
          {note:'E4',t:r*3000+2250},{note:'A4',t:r*3000+2500},{note:'C5',t:r*3000+2750},
        ]).flat(),
      ]},
      { inst: 'pluck', events: [
        // CHORUS only (12000–24000ms): rapid A4→G4→E4→C4 arpeggios every 125ms
        ...Array.from({length:96}, (_,i) => ({note:(['A4','G4','E4','C4'] as const)[i%4],t:12000+i*125})),
      ]},
      { inst: 'guitar', events: [
        // CHORUS only (12000–24000ms): Am power chord stab every 500ms
        ...Array.from({length:24}, (_,i) => [
          {note:'A3',t:12000+i*500+0},{note:'E4',t:12000+i*500+30},
        ]).flat(),
      ]},
      { inst: 'piano', events: [
        // CHORUS only (12000–24000ms): A minor chord punch every 500ms
        ...Array.from({length:24}, (_,i) => [
          {note:'A3',t:12000+i*500+0},{note:'C4',t:12000+i*500+30},{note:'E4',t:12000+i*500+60},
        ]).flat(),
      ]},
    ],
  },

  /* MOUNTAIN CHURCH — commented out
  // ── MOUNTAIN CHURCH ───────────────────────────────────────────────────────
  {
    name: 'MOUNTAIN CHURCH', emoji: '⛪',
    desc: 'Gospel with organ, choir and steady rhythm · G major · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Country gospel — kick 1+3, snare 2+4, cymbal on 1
        ...seq('kick',  0,    24000, 1500),
        ...seq('kick',  750,  24000, 3000),
        ...seq('snare', 750,  24000, 1500),
        {note:'cymbal',t:0},{note:'cymbal',t:6000},{note:'cymbal',t:12000},{note:'cymbal',t:18000},
        {note:'hihat',t:375},{note:'hihat',t:1125},{note:'hihat',t:1875},{note:'hihat',t:2625},
        {note:'hihat',t:3375},{note:'hihat',t:4125},{note:'hihat',t:4875},{note:'hihat',t:5625},
        ...Array.from({length:16}, (_,i) => ({note:'hihat',t:6000+i*1125})),
      ]},
      { inst: 'bass', events: [
        // G–D root-five gospel bass
        ...Array.from({length:8}, (_,r) => [
          {note:'G2',t:r*3000+0},{note:'D2',t:r*3000+750},
          {note:'G2',t:r*3000+1500},{note:'D2',t:r*3000+2250},
        ]).flat(),
      ]},
      { inst: 'organ', events: [
        // Full drawbar G major chords: G–C–D–G
        {note:'G3',t:0},{note:'B3',t:100},{note:'D4',t:200},
        {note:'C3',t:6000},{note:'E3',t:6100},{note:'G3',t:6200},
        {note:'D3',t:12000},{note:'F#3',t:12100},{note:'A3',t:12200},
        {note:'G3',t:18000},{note:'B3',t:18100},{note:'D4',t:18200},
        // Repeat fills
        {note:'G3',t:3000},{note:'B3',t:3100},{note:'D4',t:3200},
        {note:'C3',t:9000},{note:'E3',t:9100},{note:'G3',t:9200},
        {note:'D3',t:15000},{note:'F#3',t:15100},{note:'A3',t:15200},
        {note:'G3',t:21000},{note:'B3',t:21100},{note:'D4',t:21200},
      ]},
      { inst: 'strings', events: [
        // Sweeping fiddle-style melody in G major
        {note:'D4',t:0},{note:'E4',t:750},{note:'G4',t:1500},{note:'A4',t:2250},
        {note:'B4',t:3000},{note:'A4',t:3750},{note:'G4',t:4500},{note:'E4',t:5250},
        {note:'D4',t:6000},{note:'G4',t:6750},{note:'A4',t:7500},{note:'B4',t:8250},
        {note:'A4',t:9000},{note:'G4',t:9750},{note:'E4',t:10500},{note:'D4',t:11250},
        {note:'G4',t:12000},{note:'A4',t:12750},{note:'B4',t:13500},{note:'A4',t:14250},
        {note:'G4',t:15000},{note:'F#4',t:15750},{note:'E4',t:16500},{note:'D4',t:17250},
        {note:'G4',t:18000},{note:'A4',t:18750},{note:'B4',t:19500},{note:'A4',t:20250},
        {note:'G4',t:21000},{note:'E4',t:21750},{note:'D4',t:22500},{note:'G4',t:23250},
      ]},
      { inst: 'soprano', events: [
        // High gospel lead — soaring G major
        {note:'G4',t:750},{note:'B4',t:2250},{note:'D4',t:3750},
        {note:'G4',t:5250},{note:'A4',t:6750},{note:'B4',t:8250},
        {note:'A4',t:9750},{note:'G4',t:11250},{note:'D4',t:12750},
        {note:'G4',t:14250},{note:'B4',t:15750},{note:'A4',t:17250},
        {note:'G4',t:18750},{note:'B4',t:20250},{note:'A4',t:21750},{note:'G4',t:23250},
      ]},
      { inst: 'acoustic', events: [
        // Rhythm strum on 2 and 4
        ...Array.from({length:16}, (_,i) => [
          {note:'G3',t:750+i*1500},{note:'B3',t:800+i*1500},{note:'D4',t:850+i*1500},
        ]).flat(),
      ]},
    ],
  },
  */

  /* FULL ORCHESTRA — commented out
  // ── FULL ORCHESTRA ────────────────────────────────────────────────────────
  {
    name: 'FULL ORCHESTRA', emoji: '🎼', chorus: true,
    desc: 'Soaring orchestra with choir and strings · C major · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'bass', events: [
        // VERSE (0–12000ms): C2→G2, one note per 6000ms — glacial movement
        {note:'C2',t:0},{note:'G2',t:6000},
        // CHORUS (12000–24000ms): C2→G2→F2→G2 every 3000ms — motion builds
        {note:'C2',t:12000},{note:'G2',t:15000},{note:'F2',t:18000},{note:'G2',t:21000},
      ]},
      { inst: 'pad', events: [
        // VERSE (0–12000ms): C3+G3 open fifth — sparse, spacious
        {note:'C3',t:0},{note:'G3',t:500},
        // CHORUS (12000–24000ms): fuller C3+E3+G3 triad enters
        {note:'C3',t:12000},{note:'E3',t:12400},{note:'G3',t:12800},
      ]},
      { inst: 'strings', events: [
        // VERSE (0–12000ms): C4→E4→G4→E4 slowly every 1500ms
        {note:'C4',t:0},{note:'E4',t:1500},{note:'G4',t:3000},{note:'E4',t:4500},
        {note:'C4',t:6000},{note:'E4',t:7500},{note:'G4',t:9000},{note:'E4',t:10500},
        // CHORUS (12000–24000ms): sweeping full melody every 750ms
        {note:'G4',t:12000},{note:'A4',t:12750},{note:'B4',t:13500},{note:'C5',t:14250},
        {note:'B4',t:15000},{note:'A4',t:15750},{note:'G4',t:16500},{note:'E4',t:17250},
        {note:'F4',t:18000},{note:'G4',t:18750},{note:'A4',t:19500},{note:'C5',t:20250},
        {note:'B4',t:21000},{note:'A4',t:21750},{note:'G4',t:22500},{note:'C5',t:23250},
      ]},
      { inst: 'piano', events: [
        // VERSE (0–12000ms): arpeggiated C major, rising phrases
        ...Array.from({length:4}, (_,r) => [
          {note:'C4',t:r*3000+0},{note:'E4',t:r*3000+187},{note:'G4',t:r*3000+375},{note:'C5',t:r*3000+562},
          {note:'G4',t:r*3000+750},{note:'E4',t:r*3000+937},{note:'C4',t:r*3000+1125},{note:'E4',t:r*3000+1312},
          {note:'G4',t:r*3000+1500},{note:'C5',t:r*3000+1687},{note:'B4',t:r*3000+1875},{note:'G4',t:r*3000+2062},
        ]).flat(),
        // CHORUS (12000–24000ms): chord stabs every 750ms — strong downbeats
        ...Array.from({length:16}, (_,i) => [
          {note:'C4',t:12000+i*750+0},{note:'E4',t:12000+i*750+40},{note:'G4',t:12000+i*750+80},
        ]).flat(),
      ]},
      { inst: 'soprano', events: [
        // CHORUS only (12000–24000ms): the voice enters — G4→A4→C5→A4
        {note:'G4',t:12000},{note:'A4',t:13500},{note:'C5',t:15000},{note:'A4',t:16500},
        {note:'G4',t:18000},{note:'A4',t:19500},{note:'C5',t:21000},{note:'B4',t:22500},
      ]},
      { inst: 'organ', events: [
        // CHORUS only (12000–24000ms): organ swells in under everything
        {note:'C3',t:12000},{note:'E3',t:12150},{note:'G3',t:12300},
        {note:'F3',t:15000},{note:'A3',t:15150},{note:'C4',t:15300},
        {note:'G3',t:18000},{note:'B3',t:18150},{note:'D4',t:18300},
        {note:'C3',t:21000},{note:'E3',t:21150},{note:'G3',t:21300},
      ]},
    ],
  },
  */

  /* CATHEDRAL ECHO — commented out
  // ── CATHEDRAL ECHO ────────────────────────────────────────────────────────
  {
    name: 'CATHEDRAL ECHO', emoji: '🕌',
    desc: 'Cathedral organ with strings and soprano · A minor · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'basetone', events: [
        // Sub-bass pedal under the cathedral: A→F→C→G root tones, one per chord (6s each)
        {note:'A3',t:0},{note:'F3',t:6000},{note:'C3',t:12000},{note:'G3',t:18000},
      ]},
      { inst: 'organ', events: [
        // Am - F - C - G chord progression, 80 BPM (750ms per beat)
        {note:'A3',t:0},{note:'C4',t:150},{note:'E4',t:300},
        {note:'F3',t:3000},{note:'A3',t:3150},{note:'C4',t:3300},
        {note:'C3',t:6000},{note:'E3',t:6150},{note:'G3',t:6300},
        {note:'G3',t:9000},{note:'B3',t:9150},{note:'D4',t:9300},
        {note:'A3',t:12000},{note:'C4',t:12150},{note:'E4',t:12300},
        {note:'F3',t:15000},{note:'A3',t:15150},{note:'C4',t:15300},
        {note:'C3',t:18000},{note:'E3',t:18150},{note:'G3',t:18300},
        {note:'G3',t:21000},{note:'B3',t:21150},{note:'D4',t:21300},
      ]},
      { inst: 'strings', events: [
        // Slow bowing melody on A natural minor scale
        {note:'E4',t:0},{note:'D4',t:1500},{note:'C4',t:3000},
        {note:'B3',t:4500},{note:'A3',t:6000},{note:'G3',t:7500},
        {note:'A3',t:9000},{note:'C4',t:10500},{note:'E4',t:12000},
        {note:'F4',t:13500},{note:'E4',t:15000},{note:'D4',t:16500},
        {note:'C4',t:18000},{note:'E4',t:19500},{note:'A4',t:21000},
        {note:'G4',t:22000},{note:'E4',t:22750},{note:'A4',t:23500},
      ]},
      { inst: 'soprano', events: [
        // Floating soprano oohs on chord tones
        {note:'A4',t:750},{note:'C5',t:4500},{note:'E5',t:9000},
        {note:'D5',t:13500},{note:'C5',t:16500},{note:'A4',t:19500},
        {note:'B4',t:21750},{note:'A4',t:23250},
      ]},
    ],
  },
  */

  /* BANJO BREAKDOWN — commented out
  // ── BANJO BREAKDOWN ───────────────────────────────────────────────────────
  {
    name: 'BANJO BREAKDOWN', emoji: '🪕',
    desc: 'Bluegrass breakdown with banjo and rhythm · D major · 120 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // 120 BPM boom-bap shuffle (500ms per beat)
        ...seq('kick',  0,    24000, 1000),
        ...seq('snare', 500,  24000, 1000),
        ...seq('hihat', 0,    24000, 250),
        {note:'cymbal',t:0},{note:'cymbal',t:8000},{note:'cymbal',t:16000},
      ]},
      { inst: 'banjo', events: [
        // D major clawhammer roll pattern  D-F#-A
        {note:'D4',t:0},{note:'F#4',t:125},{note:'A4',t:250},{note:'D5',t:375},
        {note:'A4',t:500},{note:'F#4',t:625},{note:'D4',t:750},{note:'A4',t:875},
        {note:'G4',t:1000},{note:'B4',t:1125},{note:'D5',t:1250},{note:'G5',t:1375},
        {note:'D5',t:1500},{note:'B4',t:1625},{note:'G4',t:1750},{note:'D5',t:1875},
        {note:'A4',t:2000},{note:'C#5',t:2125},{note:'E5',t:2250},{note:'A5',t:2375},
        {note:'E5',t:2500},{note:'C#5',t:2625},{note:'A4',t:2750},{note:'E5',t:2875},
        {note:'D4',t:3000},{note:'F#4',t:3125},{note:'A4',t:3250},{note:'D5',t:3375},
        {note:'A4',t:3500},{note:'F#4',t:3625},{note:'D4',t:3750},{note:'F#4',t:3875},
        // Repeat with variation x3
        ...Array.from({length:5}, (_,rep) => [
          {note:'D4',t:4000+rep*4000},{note:'F#4',t:4125+rep*4000},{note:'A4',t:4250+rep*4000},{note:'D5',t:4375+rep*4000},
          {note:'A4',t:4500+rep*4000},{note:'F#4',t:4625+rep*4000},{note:'D4',t:4750+rep*4000},{note:'A3',t:4875+rep*4000},
          {note:'G4',t:5000+rep*4000},{note:'B4',t:5125+rep*4000},{note:'D5',t:5250+rep*4000},{note:'G5',t:5375+rep*4000},
          {note:'D5',t:5500+rep*4000},{note:'B4',t:5625+rep*4000},{note:'G4',t:5750+rep*4000},{note:'B4',t:5875+rep*4000},
          {note:'A4',t:6000+rep*4000},{note:'E5',t:6250+rep*4000},{note:'A5',t:6500+rep*4000},{note:'E5',t:6750+rep*4000},
          {note:'D4',t:7000+rep*4000},{note:'F#4',t:7250+rep*4000},{note:'A4',t:7500+rep*4000},{note:'D5',t:7750+rep*4000},
        ]).flat(),
      ]},
      { inst: 'piano', events: [
        // Honky-tonk fills: D/G/A chord hits + passing notes — bops with the banjo
        ...Array.from({length:6}, (_, r) => [
          // Bar 1: D chord, G pass, A chord, D resolve
          {note:'D4',t:r*4000+0},   {note:'F#4',t:r*4000+50},  {note:'A4',t:r*4000+100},
          {note:'G4',t:r*4000+375},
          {note:'G3',t:r*4000+500}, {note:'B3',t:r*4000+550},  {note:'D4',t:r*4000+600},
          {note:'A3',t:r*4000+875},
          {note:'A3',t:r*4000+1000},{note:'C#4',t:r*4000+1050},{note:'E4',t:r*4000+1100},
          {note:'G3',t:r*4000+1375},
          {note:'D4',t:r*4000+1500},{note:'F#4',t:r*4000+1550},
          {note:'E4',t:r*4000+1750},
          // Bar 2: G chord, A chord, D home
          {note:'G3',t:r*4000+2000},{note:'B3',t:r*4000+2050}, {note:'D4',t:r*4000+2100},
          {note:'A3',t:r*4000+2375},
          {note:'A3',t:r*4000+2500},{note:'C#4',t:r*4000+2550},{note:'E4',t:r*4000+2600},
          {note:'D4',t:r*4000+2875},
          {note:'D4',t:r*4000+3000},{note:'F#4',t:r*4000+3050},{note:'A4',t:r*4000+3100},
          {note:'A3',t:r*4000+3375},
          {note:'D3',t:r*4000+3500},{note:'F#3',t:r*4000+3550},{note:'A3',t:r*4000+3600},
          {note:'D4',t:r*4000+3875},
        ]).flat(),
      ]},
      { inst: 'bass', events: [
        // Walking bass — D-G-A-D  (country two-step feel)
        ...Array.from({length:8}, (_,i) => [
          {note:'D2',t:i*3000+0},{note:'E2',t:i*3000+500},{note:'F#2',t:i*3000+1000},
          {note:'G2',t:i*3000+1500},{note:'A2',t:i*3000+2000},{note:'D2',t:i*3000+2500},
        ]).flat(),
      ]},
    ],
  },
  */

  // ── SILK STRINGS ──────────────────────────────────────────────────────────
  {
    name: 'SILK STRINGS', emoji: '🎻',
    desc: 'Gentle strings and soprano over soft pluck · E minor · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'strings', events: [
        // Slow Em melody — i-VII-VI-V arc, lyrical bow strokes
        {note:'E4',t:0},{note:'D4',t:1500},{note:'B3',t:3000},
        {note:'C4',t:4500},{note:'B3',t:6000},{note:'A3',t:7500},
        {note:'G3',t:9000},{note:'B3',t:10500},{note:'D4',t:12000},
        {note:'E4',t:13500},{note:'F#4',t:15000},{note:'G4',t:16500},
        {note:'F#4',t:18000},{note:'E4',t:19500},{note:'D4',t:21000},
        {note:'B3',t:22500},{note:'E4',t:23500},
      ]},
      { inst: 'pluck', events: [
        // Arpeggiated pluck chords — Em, D, C, B
        ...Array.from({length:8}, (_,i) => {
          const roots = ['E3','D3','C3','B2','E3','D3','C3','B2'];
          const thirds = ['G3','F#3','E3','D#3','G3','F#3','E3','D#3'];
          const fifths = ['B3','A3','G3','F#3','B3','A3','G3','F#3'];
          return [
            {note:roots[i],  t:i*3000+0},
            {note:thirds[i], t:i*3000+375},
            {note:fifths[i], t:i*3000+750},
            {note:thirds[i], t:i*3000+1125},
            {note:roots[i],  t:i*3000+1500},
            {note:fifths[i], t:i*3000+1875},
            {note:thirds[i], t:i*3000+2250},
            {note:roots[i],  t:i*3000+2625},
          ];
        }).flat(),
      ]},
      { inst: 'soprano', events: [
        // Soprano ooh on long tones — chord root / fifth
        {note:'E5',t:0},{note:'B4',t:4500},{note:'G5',t:9000},
        {note:'D5',t:13500},{note:'E5',t:18000},{note:'B5',t:22000},
      ]},
    ],
  },

  // ── GARDEN PATH ───────────────────────────────────────────────────────────
  {
    name: 'GARDEN PATH', emoji: '🌻',
    desc: 'Acoustic folk with soft pluck and pad wash · C major · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'acoustic', events: [
        // C major fingerpicking — Travis pick style
        {note:'C3',t:0},{note:'G3',t:187},{note:'E3',t:375},{note:'G3',t:562},
        {note:'C3',t:750},{note:'G3',t:937},{note:'E3',t:1125},{note:'G3',t:1312},
        {note:'F3',t:1500},{note:'C4',t:1687},{note:'A3',t:1875},{note:'C4',t:2062},
        {note:'G3',t:2250},{note:'D4',t:2437},{note:'B3',t:2625},{note:'D4',t:2812},
        // Repeat with slight variation x6
        ...Array.from({length:7}, (_,rep) => [
          {note:'C3',t:3000+rep*3000+0},{note:'G3',t:3000+rep*3000+187},{note:'E3',t:3000+rep*3000+375},{note:'G3',t:3000+rep*3000+562},
          {note:'C3',t:3000+rep*3000+750},{note:'G3',t:3000+rep*3000+937},{note:'E3',t:3000+rep*3000+1125},{note:'G3',t:3000+rep*3000+1312},
          {note:'Am3',t:3000+rep*3000+1500},{note:'E3',t:3000+rep*3000+1687},{note:'A3',t:3000+rep*3000+1875},{note:'C4',t:3000+rep*3000+2062},
          {note:'G3',t:3000+rep*3000+2250},{note:'B3',t:3000+rep*3000+2437},{note:'D4',t:3000+rep*3000+2625},{note:'G3',t:3000+rep*3000+2812},
        ]).flat(),
      ]},
      { inst: 'pluck', events: [
        // Gentle melodic pluck — C major pentatonic run
        {note:'C4',t:375},{note:'D4',t:750},{note:'E4',t:1125},
        {note:'G4',t:1500},{note:'A4',t:1875},{note:'G4',t:2250},
        {note:'E4',t:2625},{note:'D4',t:3000},{note:'C4',t:3375},
        {note:'E4',t:3750},{note:'G4',t:4125},{note:'A4',t:4500},
        {note:'C5',t:4875},{note:'A4',t:5250},{note:'G4',t:5625},
        {note:'E4',t:6000},{note:'G4',t:6375},{note:'A4',t:6750},
        // Rising development
        {note:'C5',t:9000},{note:'D5',t:9375},{note:'E5',t:9750},
        {note:'G5',t:10125},{note:'E5',t:10500},{note:'D5',t:10875},
        {note:'C5',t:11250},{note:'A4',t:11625},{note:'G4',t:12000},
        // Resolve and repeat variations
        ...Array.from({length:4}, (_,i) => [
          {note:'C4',t:12375+i*3000},{note:'E4',t:12750+i*3000},{note:'G4',t:13125+i*3000},
          {note:'A4',t:13500+i*3000},{note:'C5',t:13875+i*3000},{note:'A4',t:14250+i*3000},
          {note:'G4',t:14625+i*3000},{note:'E4',t:15000+i*3000},
        ]).flat(),
      ]},
      { inst: 'pad', events: [
        // Warm pad chords sustaining through progression
        {note:'C3',t:0},{note:'E3',t:0},{note:'G3',t:0},
        {note:'F3',t:6000},{note:'A3',t:6000},{note:'C4',t:6000},
        {note:'G3',t:12000},{note:'B3',t:12000},{note:'D4',t:12000},
        {note:'C3',t:18000},{note:'E3',t:18000},{note:'G3',t:18000},
        {note:'F3',t:21000},{note:'C4',t:21000},{note:'A3',t:21000},
      ]},
    ],
  },

  /* PIPE DREAM — commented out
  // ── PIPE DREAM ────────────────────────────────────────────────────────────
  {
    name: 'PIPE DREAM', emoji: '⛪',
    desc: 'Soulful organ over steady bass and drums · G Dorian · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Slow gospel groove 100 BPM (600ms per beat)
        ...seq('kick',  0,    24000, 1200),
        ...seq('snare', 600,  24000, 1200),
        ...seq('hihat', 0,    24000, 300),
        {note:'cymbal',t:0},{note:'cymbal',t:9600},{note:'cymbal',t:19200},
      ]},
      { inst: 'organ', events: [
        // G Dorian chords: Gm - Bb - F - Eb - Cm - F - Gm
        {note:'G2',t:0},{note:'A#2',t:150},{note:'D3',t:300},
        {note:'A#2',t:2400},{note:'D3',t:2550},{note:'F3',t:2700},
        {note:'F2',t:4800},{note:'A2',t:4950},{note:'C3',t:5100},
        {note:'D#2',t:7200},{note:'G2',t:7350},{note:'A#2',t:7500},
        {note:'C3',t:9600},{note:'D#3',t:9750},{note:'G3',t:9900},
        {note:'F2',t:12000},{note:'A2',t:12150},{note:'C3',t:12300},
        {note:'G2',t:14400},{note:'A#2',t:14550},{note:'D3',t:14700},
        // Repeat progression
        {note:'G2',t:16800},{note:'A#2',t:16950},{note:'D3',t:17100},
        {note:'A#2',t:19200},{note:'D3',t:19350},{note:'F3',t:19500},
        {note:'F2',t:20400},{note:'A2',t:20550},{note:'C3',t:20700},
        {note:'G2',t:21600},{note:'D3',t:21750},{note:'G3',t:21900},
      ]},
      { inst: 'strings', events: [
        // Sweeping string melody in G Dorian
        {note:'G4',t:0},{note:'A4',t:600},{note:'A#4',t:1200},
        {note:'C5',t:2400},{note:'D5',t:3000},{note:'C5',t:3600},
        {note:'A#4',t:4800},{note:'A4',t:5400},{note:'G4',t:6000},
        {note:'F4',t:7200},{note:'G4',t:7800},{note:'A4',t:8400},
        {note:'A#4',t:9600},{note:'C5',t:10200},{note:'D5',t:10800},
        {note:'F5',t:12000},{note:'D5',t:12600},{note:'C5',t:13200},
        {note:'A#4',t:14400},{note:'G4',t:15000},{note:'F4',t:15600},
        {note:'G4',t:16800},{note:'A4',t:17400},{note:'C5',t:18000},
        {note:'D5',t:19200},{note:'F5',t:19800},{note:'D5',t:20400},
        {note:'C5',t:21600},{note:'A#4',t:22200},{note:'G4',t:23000},
      ]},
      { inst: 'bass', events: [
        // Deep bass root movement
        {note:'G2',t:0},{note:'A#2',t:2400},{note:'F2',t:4800},
        {note:'D#2',t:7200},{note:'C2',t:9600},{note:'F2',t:12000},
        {note:'G2',t:14400},{note:'G2',t:16800},{note:'A#2',t:19200},
        {note:'F2',t:20400},{note:'G2',t:21600},{note:'D2',t:22800},
      ]},
    ],
  },
  */

  // ── APPALACHIAN ───────────────────────────────────────────────────────────
  {
    name: 'APPALACHIAN', emoji: '⛰️',
    desc: 'Banjo and fiddle in a mountain groove · G major · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Country shuffle feel — kick on 1 and 3, snare on 2 and 4
        ...seq('kick',  0,    24000, 1200),
        ...seq('kick',  600,  24000, 2400),
        ...seq('snare', 600,  24000, 1200),
        ...seq('hihat', 0,    24000, 300),
      ]},
      { inst: 'banjo', events: [
        // Scruggs-style roll in G — forward-reverse pattern
        {note:'G3',t:0},{note:'B3',t:100},{note:'D4',t:200},{note:'G4',t:300},
        {note:'D4',t:400},{note:'B3',t:500},{note:'G3',t:600},{note:'D4',t:700},
        {note:'C4',t:800},{note:'E4',t:900},{note:'G4',t:1000},{note:'C5',t:1100},
        {note:'G4',t:1200},{note:'E4',t:1300},{note:'C4',t:1400},{note:'G4',t:1500},
        {note:'D4',t:1600},{note:'F#4',t:1700},{note:'A4',t:1800},{note:'D4',t:1900},
        {note:'A4',t:2000},{note:'F#4',t:2100},{note:'D4',t:2200},{note:'A3',t:2300},
        ...Array.from({length:7}, (_,rep) => [
          {note:'G3',t:2400+rep*3000+0},{note:'B3',t:2400+rep*3000+100},{note:'D4',t:2400+rep*3000+200},{note:'G4',t:2400+rep*3000+300},
          {note:'D4',t:2400+rep*3000+400},{note:'B3',t:2400+rep*3000+500},{note:'G3',t:2400+rep*3000+600},{note:'D3',t:2400+rep*3000+700},
          {note:'C4',t:2400+rep*3000+800},{note:'E4',t:2400+rep*3000+900},{note:'G4',t:2400+rep*3000+1000},{note:'C5',t:2400+rep*3000+1100},
          {note:'G4',t:2400+rep*3000+1200},{note:'E4',t:2400+rep*3000+1300},{note:'C4',t:2400+rep*3000+1400},{note:'E4',t:2400+rep*3000+1500},
          {note:'D4',t:2400+rep*3000+1600},{note:'A4',t:2400+rep*3000+1800},{note:'F#4',t:2400+rep*3000+2000},{note:'D4',t:2400+rep*3000+2200},
        ]).flat(),
      ]},
      { inst: 'strings', events: [
        // Fiddle melody — mountain minor pentatonic singalong over the banjo roll
        {note:'D4',t:0},{note:'E4',t:600},{note:'G4',t:1200},{note:'A4',t:1800},
        {note:'B4',t:2400},{note:'A4',t:3000},{note:'G4',t:3600},{note:'E4',t:4200},
        {note:'D4',t:4800},{note:'G4',t:5400},{note:'A4',t:6000},{note:'B4',t:6600},
        {note:'A4',t:7200},{note:'G4',t:7800},{note:'E4',t:8400},{note:'D4',t:9000},
        {note:'G3',t:9600},{note:'A3',t:10200},{note:'B3',t:10800},{note:'D4',t:11400},
        {note:'E4',t:12000},{note:'F#4',t:12600},{note:'G4',t:13200},{note:'A4',t:13800},
        {note:'B4',t:14400},{note:'A4',t:15000},{note:'G4',t:15600},{note:'F#4',t:16200},
        {note:'E4',t:16800},{note:'D4',t:17400},{note:'E4',t:18000},{note:'G4',t:18600},
        {note:'A4',t:19200},{note:'G4',t:19800},{note:'E4',t:20400},{note:'D4',t:21000},
        {note:'G4',t:21600},{note:'A4',t:22200},{note:'B4',t:22800},{note:'G4',t:23400},
      ]},
      { inst: 'bass', events: [
        // Root-five walking bass
        ...Array.from({length:8}, (_,i) => [
          {note:'G2',t:i*3000+0},{note:'D2',t:i*3000+750},{note:'G2',t:i*3000+1500},{note:'D2',t:i*3000+2250},
        ]).flat(),
      ]},
    ],
  },

  // ── DREAM STATE ───────────────────────────────────────────────────────────
  /* {
    name: 'DREAM STATE', emoji: '💫',
    desc: 'Dreamy choir over shimmering strings · F major · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'pad', events: [
        // Slowly evolving F major chords — pillowy ambient
        {note:'F3',t:0},{note:'A3',t:300},{note:'C4',t:600},
        {note:'Bb3',t:6000},{note:'D4',t:6300},{note:'F4',t:6600},
        {note:'Gm3',t:12000},{note:'A#3',t:12000},{note:'D4',t:12300},
        {note:'C4',t:18000},{note:'E4',t:18300},{note:'G4',t:18600},
        {note:'F3',t:21000},{note:'A3',t:21300},{note:'C4',t:21600},
      ]},
      { inst: 'soprano', events: [
        // Dreamy soprano melody — slow and wide vibrato
        {note:'F5',t:0},{note:'A5',t:3000},{note:'G5',t:6000},
        {note:'D5',t:9000},{note:'C5',t:12000},{note:'A4',t:15000},
        {note:'C5',t:18000},{note:'F5',t:21000},{note:'A5',t:23000},
      ]},
      { inst: 'strings', events: [
        // Shimmering string countermelody
        {note:'C5',t:1500},{note:'D5',t:3000},{note:'F5',t:4500},
        {note:'G5',t:6000},{note:'F5',t:7500},{note:'D5',t:9000},
        {note:'C5',t:10500},{note:'A4',t:12000},{note:'C5',t:13500},
        {note:'D5',t:15000},{note:'F5',t:16500},{note:'G5',t:18000},
        {note:'A5',t:19500},{note:'G5',t:21000},{note:'F5',t:22500},
        {note:'C5',t:23500},
      ]},
      { inst: 'pluck', events: [
        // Distant, sparse pluck punctuation
        {note:'F4',t:1500},{note:'C5',t:4500},{note:'A4',t:7500},
        {note:'D5',t:10500},{note:'F4',t:13500},{note:'G4',t:16500},
        {note:'C5',t:19500},{note:'F4',t:22500},
      ]},
    ],
  }, */

  // ── KOTO NIGHT ────────────────────────────────────────────────────────────
  {
    name: 'KOTO NIGHT', emoji: '🌕',
    desc: 'Moonlit koto over ambient strings · A hirajoshi · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'pluck', events: [
        // Hirajoshi scale: A C D# E G# — koto-style cascading runs
        {note:'A4',t:0},{note:'G#4',t:187},{note:'E4',t:375},{note:'D#4',t:562},
        {note:'C4',t:750},{note:'A3',t:937},{note:'C4',t:1125},{note:'D#4',t:1312},
        {note:'E4',t:1500},{note:'G#4',t:1687},{note:'A4',t:1875},{note:'E5',t:2062},
        {note:'D#5',t:2250},{note:'C5',t:2437},{note:'A4',t:2625},{note:'G#3',t:2812},
        // Second phrase
        {note:'A3',t:3000},{note:'C4',t:3187},{note:'D#4',t:3375},{note:'E4',t:3562},
        {note:'G#4',t:3750},{note:'A4',t:3937},{note:'C5',t:4125},{note:'D#5',t:4312},
        {note:'E5',t:4500},{note:'G#5',t:4687},{note:'A5',t:4875},{note:'G#5',t:5062},
        {note:'E5',t:5250},{note:'D#5',t:5437},{note:'C5',t:5625},{note:'A4',t:5812},
        // Development x4
        ...Array.from({length:6}, (_,rep) => [
          {note:'E4',t:6000+rep*3000+0},{note:'G#4',t:6000+rep*3000+187},{note:'A4',t:6000+rep*3000+375},
          {note:'C5',t:6000+rep*3000+562},{note:'D#5',t:6000+rep*3000+750},{note:'E5',t:6000+rep*3000+937},
          {note:'D#5',t:6000+rep*3000+1125},{note:'C5',t:6000+rep*3000+1312},{note:'A4',t:6000+rep*3000+1500},
          {note:'G#4',t:6000+rep*3000+1687},{note:'E4',t:6000+rep*3000+1875},{note:'C4',t:6000+rep*3000+2062},
          {note:'A3',t:6000+rep*3000+2250},{note:'C4',t:6000+rep*3000+2437},{note:'E4',t:6000+rep*3000+2625},{note:'G#4',t:6000+rep*3000+2812},
        ]).flat(),
      ]},
      { inst: 'strings', events: [
        // Bowed drone on A — slow breath
        {note:'A3',t:0},{note:'E4',t:1500},{note:'A3',t:6000},
        {note:'G#3',t:9000},{note:'A3',t:12000},{note:'E4',t:15000},
        {note:'C4',t:18000},{note:'A3',t:21000},{note:'E4',t:23500},
      ]},
      { inst: 'pad', events: [
        // Ambient pad washes
        {note:'A3',t:0},{note:'A3',t:8000},{note:'A3',t:16000},
        {note:'G#3',t:4000},{note:'G#3',t:12000},{note:'G#3',t:20000},
      ]},
    ],
  },

  // ── SWAMP GOSPEL ──────────────────────────────────────────────────────────
  {
    name: 'SWAMP GOSPEL', emoji: '🐊',
    desc: 'Swamp gospel with gritty organ and blues · C blues · 100 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'drums', events: [
        // Slow 12-bar blues shuffle — 100 BPM
        ...seq('kick',  0,    24000, 600),
        ...seq('snare', 600,  24000, 1200),
        ...seq('hihat', 0,    24000, 300),
        {note:'cymbal',t:0},{note:'cymbal',t:12000},
        {note:'tom',t:5400},{note:'tom',t:11400},{note:'tom',t:17400},{note:'tom',t:23400},
      ]},
      { inst: 'organ', events: [
        // 12-bar blues in C: C7 - F7 - C7 - G7 - F7 - C7
        // C7 (4 bars)
        {note:'C3',t:0},{note:'E3',t:150},{note:'G3',t:300},{note:'A#3',t:450},
        {note:'C3',t:2400},{note:'E3',t:2550},{note:'G3',t:2700},{note:'A#3',t:2850},
        {note:'C3',t:4800},{note:'E3',t:4950},{note:'G3',t:5100},{note:'A#3',t:5250},
        {note:'C3',t:7200},{note:'E3',t:7350},{note:'G3',t:7500},{note:'A#3',t:7650},
        // F7 (2 bars)
        {note:'F3',t:9600},{note:'A3',t:9750},{note:'C4',t:9900},{note:'D#4',t:10050},
        {note:'F3',t:12000},{note:'A3',t:12150},{note:'C4',t:12300},{note:'D#4',t:12450},
        // C7 (2 bars)
        {note:'C3',t:14400},{note:'E3',t:14550},{note:'G3',t:14700},{note:'A#3',t:14850},
        {note:'C3',t:16800},{note:'E3',t:16950},{note:'G3',t:17100},{note:'A#3',t:17250},
        // G7 (1 bar)
        {note:'G3',t:19200},{note:'B3',t:19350},{note:'D4',t:19500},{note:'F4',t:19650},
        // F7 (1 bar)
        {note:'F3',t:20400},{note:'A3',t:20550},{note:'C4',t:20700},{note:'D#4',t:20850},
        // C7 (1 bar) G7 turnaround
        {note:'C3',t:21600},{note:'E3',t:21750},{note:'G3',t:21900},{note:'A#3',t:22050},
        {note:'G3',t:22800},{note:'B3',t:22950},{note:'D4',t:23100},{note:'F4',t:23250},
      ]},
      { inst: 'acoustic', events: [
        // Slide guitar feel — blues bends on C blues scale
        {note:'C4',t:300},{note:'D#4',t:900},{note:'F4',t:1500},{note:'F#4',t:1800},
        {note:'G4',t:2100},{note:'A#4',t:2700},{note:'G4',t:3300},{note:'F4',t:3600},
        {note:'D#4',t:4200},{note:'C4',t:4800},{note:'G3',t:5400},{note:'C4',t:6000},
        {note:'F4',t:9600},{note:'A4',t:10200},{note:'C5',t:10800},{note:'A#4',t:11400},
        {note:'A4',t:12000},{note:'G4',t:12600},{note:'F4',t:13200},{note:'D#4',t:13800},
        {note:'C4',t:14400},{note:'D#4',t:15000},{note:'F4',t:15600},{note:'G4',t:16200},
        {note:'A#4',t:16800},{note:'G4',t:17400},{note:'F4',t:18000},{note:'D#4',t:18600},
        {note:'G4',t:19200},{note:'F4',t:19800},{note:'D#4',t:20400},{note:'C4',t:21000},
        {note:'G3',t:21600},{note:'A#3',t:22200},{note:'C4',t:22800},{note:'G4',t:23400},
      ]},
      { inst: 'bass', events: [
        // Swampy blues bass — root-5th shuffle
        {note:'C2',t:0},{note:'G2',t:300},{note:'C2',t:600},{note:'G2',t:900},
        {note:'C2',t:1200},{note:'G2',t:1500},{note:'C2',t:1800},{note:'G2',t:2100},
        {note:'C2',t:2400},{note:'G2',t:2700},{note:'C2',t:3000},{note:'G2',t:3300},
        {note:'C2',t:3600},{note:'G2',t:3900},{note:'C2',t:4200},{note:'G2',t:4500},
        {note:'C2',t:4800},{note:'G2',t:5100},{note:'C2',t:5400},{note:'A#2',t:5700},
        {note:'C2',t:6000},{note:'G2',t:6300},{note:'C2',t:6600},{note:'G2',t:6900},
        {note:'C2',t:7200},{note:'G2',t:7500},{note:'C2',t:7800},{note:'G2',t:8100},
        {note:'C2',t:8400},{note:'G2',t:8700},{note:'C2',t:9000},{note:'G2',t:9300},
        // F7 bars
        {note:'F2',t:9600},{note:'C3',t:9900},{note:'F2',t:10200},{note:'C3',t:10500},
        {note:'F2',t:10800},{note:'C3',t:11100},{note:'F2',t:11400},{note:'C3',t:11700},
        {note:'F2',t:12000},{note:'C3',t:12300},{note:'F2',t:12600},{note:'C3',t:12900},
        {note:'F2',t:13200},{note:'C3',t:13500},{note:'F2',t:13800},{note:'C3',t:14100},
        // Back to C7
        {note:'C2',t:14400},{note:'G2',t:14700},{note:'C2',t:15000},{note:'G2',t:15300},
        {note:'C2',t:15600},{note:'G2',t:15900},{note:'C2',t:16200},{note:'G2',t:16500},
        {note:'C2',t:16800},{note:'G2',t:17100},{note:'A#2',t:17400},{note:'G2',t:17700},
        // G7
        {note:'G2',t:19200},{note:'D3',t:19500},{note:'G2',t:19800},{note:'D3',t:20100},
        // F7
        {note:'F2',t:20400},{note:'C3',t:20700},{note:'F2',t:21000},{note:'C3',t:21300},
        // C7 and turnaround
        {note:'C2',t:21600},{note:'G2',t:21900},{note:'C2',t:22200},{note:'G2',t:22500},
        {note:'G2',t:22800},{note:'D3',t:23100},{note:'G2',t:23400},{note:'C2',t:23700},
      ]},
    ],
  },

  /* PHANTOM SIGNAL — commented out
  // ── PHANTOM SIGNAL ────────────────────────────────────────────────────────
  {
    name: 'PHANTOM SIGNAL', emoji: '👁️',
    desc: 'Haunting soprano over spectral strings · D minor · 80 BPM · 24s',
    dur: 24000,
    tracks: [
      { inst: 'soprano', events: [
        // Hauntingly slow vocal ooh melody — Dm natural minor
        {note:'D5',t:0},{note:'F5',t:2250},{note:'A5',t:4500},
        {note:'G5',t:6750},{note:'F5',t:9000},{note:'E5',t:11250},
        {note:'D5',t:13500},{note:'C5',t:15750},{note:'A#4',t:18000},
        {note:'A4',t:20250},{note:'D5',t:22500},
      ]},
      { inst: 'strings', events: [
        // Tremolo-like countermelody — eerily swirling
        {note:'A4',t:750},{note:'F4',t:1500},{note:'D4',t:2250},
        {note:'C4',t:3000},{note:'A3',t:3750},{note:'F3',t:4500},
        {note:'G3',t:5250},{note:'A3',t:6000},{note:'C4',t:6750},
        {note:'D4',t:7500},{note:'F4',t:8250},{note:'A4',t:9000},
        {note:'G4',t:9750},{note:'F4',t:10500},{note:'E4',t:11250},
        {note:'D4',t:12000},{note:'C4',t:12750},{note:'A3',t:13500},
        {note:'A#3',t:14250},{note:'C4',t:15000},{note:'D4',t:15750},
        {note:'F4',t:16500},{note:'A4',t:17250},{note:'C5',t:18000},
        {note:'A4',t:18750},{note:'G4',t:19500},{note:'F4',t:20250},
        {note:'E4',t:21000},{note:'D4',t:21750},{note:'C4',t:22500},
        {note:'A3',t:23250},{note:'D4',t:23700},
      ]},
      { inst: 'pad', events: [
        // Deep, evolving pad drones — Dm, Gm, A, Dm
        {note:'D3',t:0},{note:'F3',t:300},{note:'A3',t:600},
        {note:'G3',t:6000},{note:'A#3',t:6300},{note:'D4',t:6600},
        {note:'A3',t:12000},{note:'C#4',t:12300},{note:'E4',t:12600},
        {note:'D3',t:18000},{note:'F3',t:18300},{note:'A3',t:18600},
        {note:'G3',t:21000},{note:'A3',t:21300},{note:'D4',t:21600},
      ]},
      { inst: 'bass', events: [
        // Sparse, ghostly bass movement
        {note:'D3',t:0},{note:'A3',t:3000},{note:'G3',t:6000},
        {note:'F3',t:9000},{note:'D3',t:12000},{note:'A3',t:15000},
        {note:'A#3',t:18000},{note:'A3',t:21000},{note:'D3',t:23500},
      ]},
    ],
  },
  */
];

function PianoSection() {
  const [instrument, setInstrument] = useState('piano');
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string|null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [exportingFor, setExportingFor] = useState<'share'|'tweet'|'linkedin'|null>(null);
  const isExporting = exportingFor !== null;
  const [toast, setToast] = useState<string | null>(null);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicId, setSelectedMicId] = useState('');

  const audioCtxRef = useRef<AudioContext|null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode|null>(null);
  const isRecordingRef = useRef(false);
  const recEventsRef = useRef<NoteEvent[]>([]);
  const recInstRef = useRef('piano');
  const recStartRef = useRef(0);
  const loopTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const loopIntervalRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const loopDurRef = useRef(4000);
  const trackIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const demoScrollRef = useRef<HTMLDivElement|null>(null);
  const activeNotesRef = useRef<Map<string,{note:string;birth:number}>>(new Map());
  const tracksVizRef  = useRef<Track[]>([]);
  const particlesRef = useRef<{x:number;y:number;vy:number;life:number;color:string}[]>([]);
  const chunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream|null>(null);
  const micStreamSrcRef = useRef<MediaStreamAudioSourceNode|null>(null);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const micChunksRef = useRef<Blob[]>([]);
  const micPlaybackMapRef = useRef<Map<number, MicPlayback>>(new Map());
  const micAnalyserRef = useRef<AnalyserNode|null>(null);
  const playStartRef = useRef<number>(0);
  const trackManagerRef = useRef<HTMLDivElement|null>(null);
  const playSpeedRef = useRef(1.0);
  const [playSpeed, setPlaySpeed] = useState(1.0);
  const [openEditors, setOpenEditors] = useState<Set<number>>(new Set());

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext)();
      loadPianoSamples(audioCtxRef.current);   // fire-and-forget; falls back to synthesis
      loadAcousticSamples(audioCtxRef.current);
      loadGuitarElSamples(audioCtxRef.current);
      loadBassSamples(audioCtxRef.current);
      loadChoirSamples(audioCtxRef.current);
      loadVoxSamples(audioCtxRef.current);
      initCornVoices();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const getDest = useCallback(() => {
    const ctx = getCtx();
    if (!destRef.current) destRef.current = ctx.createMediaStreamDestination();
    return destRef.current;
  }, [getCtx]);

  const makeDrum = useCallback((padId: string) => {
    const ctx = getCtx();
    const dest = getDest();
    const t = ctx.currentTime;
    const wire = (n: AudioNode) => { n.connect(ctx.destination); n.connect(dest); };

    const noise = (dur: number, filter: 'highpass'|'bandpass', freq: number, vol: number) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = filter; filt.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(filt); filt.connect(g); wire(g);
      src.start(t); src.stop(t + dur);
    };

    const tone = (f0: number, f1: number, vol: number, dur: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(f0, t);
      if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); wire(g); o.start(t); o.stop(t + dur);
    };

    if (padId === 'kick')   { tone(150, 45, 1.0, 0.45); }
    if (padId === 'snare')  { noise(0.18, 'highpass', 1200, 0.8); tone(200, 120, 0.4, 0.12); }
    if (padId === 'hihat')  { noise(0.06, 'highpass', 8000, 0.55); }
    if (padId === 'tom')    { tone(110, 55, 0.7, 0.35); }
    if (padId === 'clap')   { [0, 0.012, 0.024].forEach(d => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const filt = ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = 1800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.7, t + d);
      g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.08);
      src.connect(filt); filt.connect(g); wire(g); src.start(t + d); src.stop(t + d + 0.08);
    }); }
    if (padId === 'cymbal') { noise(0.8, 'highpass', 6000, 0.45); }
  }, [getCtx, getDest]);

  const playNote = useCallback((note: string, inst: string, record = true, mods?: TrackMods) => {
    const ctx = getCtx();
    const dest = getDest();
    const t = ctx.currentTime;
    const pitchRatio = (mods?.semitones && inst !== 'drums') ? Math.pow(2, mods.semitones / 12) : 1;

    // Effects bus: all instrument nodes connect here → gain → pan → [filter] → [echo] → [reverb] → out
    const effectsBus = ctx.createGain(); effectsBus.gain.value = 1.0;
    const busGain = ctx.createGain();
    busGain.gain.value = (mods?.gain !== undefined && inst !== 'drums') ? mods.gain : 1;
    const busPan = ctx.createStereoPanner();
    busPan.pan.value = (mods?.pan && inst !== 'drums') ? mods.pan : 0;
    effectsBus.connect(busGain); busGain.connect(busPan);
    let chainTail: AudioNode = busPan;
    if (mods?.filterType && mods.filterType !== 'none' && inst !== 'drums') {
      const filt = ctx.createBiquadFilter();
      filt.type = mods.filterType; filt.frequency.value = mods.filterFreq ?? 2000;
      chainTail.connect(filt); chainTail = filt;
    }
    const echoWet: AudioNode | null = (() => {
      if (!mods?.echo || inst === 'drums') return null;
      const delay = ctx.createDelay(2.0); delay.delayTime.value = (mods.echoMs ?? 300) / 1000;
      const fb = ctx.createGain(); fb.gain.value = 0.35;
      const wet = ctx.createGain(); wet.gain.value = 0.4;
      chainTail.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet);
      return wet;
    })();
    const revWet: AudioNode | null = (() => {
      if (!mods?.reverb || inst === 'drums') return null;
      const conv = ctx.createConvolver(); conv.buffer = makeReverbBuf(ctx, 1.5 + mods.reverb * 2.5);
      const wet = ctx.createGain(); wet.gain.value = mods.reverb * 0.8;
      chainTail.connect(conv); conv.connect(wet); return wet;
    })();
    const toOut = (dst: AudioNode) => { chainTail.connect(dst); echoWet?.connect(dst); revWet?.connect(dst); };
    toOut(ctx.destination); toOut(dest);
    const wire = (src: AudioNode) => { src.connect(effectsBus); };
    // Chorus: delay + LFO modulation on delay time — thickens and widens the sound
    const wireChorus = (src: AudioNode, dur: number) => {
      const delay = ctx.createDelay(0.05);
      delay.delayTime.value = 0.023;
      const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
      lfo.frequency.value = 1.3; lfoG.gain.value = 0.011;
      lfo.connect(lfoG); lfoG.connect(delay.delayTime);
      const dry = ctx.createGain(); dry.gain.value = 0.68;
      const wet = ctx.createGain(); wet.gain.value = 0.44;
      src.connect(dry); wire(dry);
      src.connect(delay); delay.connect(wet); wire(wet);
      lfo.start(t); lfo.stop(t + dur + 0.06);
    };
    const mk = (type: OscillatorType, f: number, vol: number, dec: number) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dec);
      o.connect(g); wire(g); o.start(t); o.stop(t + dec);
    };

    if (inst === 'drums') {
      makeDrum(note);
    } else {
      const freq = (FREQS[note] ?? 0) * pitchRatio;
      if (!freq) return;
      if (inst === 'piano') {
        // Register-dependent decay: bass notes ring longer than treble
        const noteNum = Math.log2(freq / 130.81) * 12;
        const dur = Math.max(1.4, 3.8 - (noteNum / 36) * 2.0);
        // Hammer thump — keep the physical attack transient regardless of sample/synthesis path
        const hLen = Math.floor(ctx.sampleRate * 0.008);
        const hBuf = ctx.createBuffer(1, hLen, ctx.sampleRate);
        const hd = hBuf.getChannelData(0);
        for (let i = 0; i < hLen; i++) hd[i] = (Math.random()*2-1) * Math.exp(-i / hLen * 8);
        const hs = ctx.createBufferSource(); hs.buffer = hBuf;
        const hf = ctx.createBiquadFilter(); hf.type = 'bandpass'; hf.frequency.value = 600; hf.Q.value = 0.9;
        const hg = ctx.createGain(); hg.gain.value = 0.22;
        hs.connect(hf); hf.connect(hg); wire(hg); hs.start(t);
        // Sample path: pitch-shifted Salamander Grand Piano buffer
        const sKey = PIANO_SAMPLE_MAP[note];
        const sBuf = sKey ? pianoCache.get(sKey) : undefined;
        if (sBuf) {
          const src = ctx.createBufferSource(); src.buffer = sBuf;
          src.playbackRate.value = freq / SALM_HZ[sKey];
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.68, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(g); wire(g); src.start(t); src.stop(t + dur + 0.5);
        } else {
          // Synthesis fallback: triangle strings + inharmonic partials
          [-2, 0, 2].forEach(det => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'triangle'; o.frequency.setValueAtTime(freq, t); o.detune.setValueAtTime(det, t);
            g.gain.setValueAtTime(0.28, t);
            g.gain.exponentialRampToValueAtTime(0.13, t + 0.3);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); wire(g); o.start(t); o.stop(t + dur);
          });
          ([
            [2, 1.0002, 0.10, dur * 0.68],
            [3, 1.0005, 0.055, dur * 0.50],
            [4, 1.001,  0.028, dur * 0.36],
            [5, 1.002,  0.016, dur * 0.26],
            [6, 1.003,  0.009, dur * 0.18],
          ] as [number,number,number,number][]).forEach(([mult, sharp, vol, pdur]) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.setValueAtTime(freq * mult * sharp, t);
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(vol * 0.4, t + 0.28);
            g.gain.exponentialRampToValueAtTime(0.001, t + pdur);
            o.connect(g); wire(g); o.start(t); o.stop(t + pdur);
          });
        }
      }
      else if (inst === 'synth') {
        // Sawtooth + lowpass filter — bare oscillator without filter isn't a synth
        const o = ctx.createOscillator(); const g = ctx.createGain();
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200; lp.Q.value = 3;
        o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t+0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t+1.8);
        o.connect(lp); lp.connect(g); wireChorus(g, 1.8); o.start(t); o.stop(t+1.8);
      }
      else if (inst === 'bass') {
        const sKey = BASS_MAP[note];
        const sBuf = sKey ? bassCache.get(sKey) : undefined;
        if (sBuf) {
          const dur = 2.5;
          const src = ctx.createBufferSource(); src.buffer = sBuf;
          src.playbackRate.value = freq / BASS_HZ[sKey];
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.8, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(g); wire(g); src.start(t); src.stop(t + dur + 0.3);
        } else {
          mk('sine', freq, 0.55, 2.0);
          mk('sine', freq * 2, 0.15, 1.2);
          mk('triangle', freq, 0.18, 0.8);
        }
      }
      else if (inst === 'basetone') {
        // Deep sub-bass tone: pure sine fundamentals, no resonance, punchy decay
        const subFreq = freq / 2; // one octave down for true sub-bass depth
        mk('sine',     subFreq,     0.70, 2.0);
        mk('sine',     subFreq * 2, 0.20, 1.2);
        mk('triangle', subFreq,     0.22, 0.9);
      }
      else if (inst === 'pad') {
        // Triangle voices (warmer than sine) + octave shimmer, all through chorus bus
        const padBus = ctx.createGain(); padBus.gain.value = 1.0;
        [-8,0,8].forEach(det => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(freq, t); o.detune.setValueAtTime(det, t);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t+0.3);
          g.gain.setValueAtTime(0.12, t+1.2); g.gain.exponentialRampToValueAtTime(0.001, t+2.8);
          o.connect(g); g.connect(padBus); o.start(t); o.stop(t+2.8);
        });
        const os = ctx.createOscillator(); const gs = ctx.createGain();
        os.type = 'sine'; os.frequency.setValueAtTime(freq*2, t);
        gs.gain.setValueAtTime(0, t); gs.gain.linearRampToValueAtTime(0.04, t+0.6);
        gs.gain.exponentialRampToValueAtTime(0.001, t+2.8);
        os.connect(gs); gs.connect(padBus); os.start(t); os.stop(t+2.8);
        wireChorus(padBus, 2.8);
      }
      else if (inst === 'pluck') {
        // Noise exciter (the pluck attack) + sawtooth body
        const aLen = Math.floor(ctx.sampleRate * 0.008);
        const aBuf = ctx.createBuffer(1, aLen, ctx.sampleRate);
        const ad = aBuf.getChannelData(0);
        for (let i = 0; i < aLen; i++) ad[i] = (Math.random()*2-1) * Math.exp(-i/aLen*6);
        const asSrc = ctx.createBufferSource(); asSrc.buffer = aBuf;
        const ag = ctx.createGain(); ag.gain.value = 0.3;
        asSrc.connect(ag); wire(ag); asSrc.start(t);
        const dur = Math.max(0.15, 0.6 - (freq - 130) / 1200);
        mk('sawtooth', freq, 0.5, dur);
        mk('sawtooth', freq * 2, 0.2, dur * 0.5);
      }
      else if (inst === 'guitar') {
        const sKey = GUIT_EL_MAP[note];
        const sBuf = sKey ? guitarElCache.get(sKey) : undefined;
        if (sBuf) {
          const dur = 1.8;
          const src = ctx.createBufferSource(); src.buffer = sBuf;
          src.playbackRate.value = freq / GUIT_EL_HZ[sKey];
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.7, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(g); wire(g); src.start(t); src.stop(t + dur + 0.3);
        } else {
        // Electric: tanh soft-clip, mid scoop, realistic cab sim, tighter detuning
        const dur = 1.2;
        const ws = ctx.createWaveShaper();
        const N = 512; const crv = new Float32Array(N);
        const drive = 5; // warm blues/rock overdrive
        for (let i = 0; i < N; i++) {
          const x = (i * 2 / (N - 1)) - 1;
          crv[i] = Math.tanh(x * drive) / Math.tanh(drive);
        }
        ws.curve = crv; ws.oversample = '4x';
        // Mid scoop (classic electric guitar scooped EQ character)
        const midScoop = ctx.createBiquadFilter();
        midScoop.type = 'peaking'; midScoop.frequency.value = 600; midScoop.gain.value = -4; midScoop.Q.value = 0.9;
        // Presence at 3.2kHz (Tele/Strat cut-through, not 2.8kHz which sounds honky)
        const presence = ctx.createBiquadFilter();
        presence.type = 'peaking'; presence.frequency.value = 3200; presence.gain.value = 8; presence.Q.value = 0.9;
        // Realistic cab sim: LP at 5kHz (cabs roll off hard above 4.5-6kHz), HP at 80Hz
        const cabLP = ctx.createBiquadFilter(); cabLP.type = 'lowpass'; cabLP.frequency.value = 5000;
        const cabHP = ctx.createBiquadFilter(); cabHP.type = 'highpass'; cabHP.frequency.value = 80;
        const out = ctx.createGain(); out.gain.value = 0.32;
        ws.connect(midScoop); midScoop.connect(presence); presence.connect(cabLP); cabLP.connect(cabHP); cabHP.connect(out); wire(out);
        // Tighter detuning: ±5 cents (was ±14 — too wide, sounded like 12-string)
        [[0, 0.7], [5, 0.4], [-5, 0.35]].forEach(([det, vol]) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, t); o.detune.setValueAtTime(det, t);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(vol, t + 0.004);
          g.gain.setValueAtTime(vol * 0.88, t + 0.15); // sustain plateau before slow decay
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          o.connect(g); g.connect(ws); o.start(t); o.stop(t + dur);
        });
        // Pick click (4ms)
        const pLen = Math.floor(ctx.sampleRate * 0.004);
        const pBuf = ctx.createBuffer(1, pLen, ctx.sampleRate);
        const pd = pBuf.getChannelData(0);
        for (let i = 0; i < pLen; i++) pd[i] = (Math.random() * 2 - 1) * Math.exp(-i / pLen * 12);
        const ps = ctx.createBufferSource(); ps.buffer = pBuf;
        const pf = ctx.createBiquadFilter(); pf.type = 'bandpass'; pf.frequency.value = 4500; pf.Q.value = 1.5;
        const pg = ctx.createGain(); pg.gain.value = 0.20;
        ps.connect(pf); pf.connect(pg); wire(pg); ps.start(t);
        } // end synthesis fallback
      }
      else if (inst === 'acoustic') {
        const sKey = GUIT_AC_MAP[note];
        const sBuf = sKey ? acousticCache.get(sKey) : undefined;
        if (sBuf) {
          const dur = 3.2;
          const src = ctx.createBufferSource(); src.buffer = sBuf;
          src.playbackRate.value = freq / GUIT_AC_HZ[sKey];
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.75, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(g); wire(g); src.start(t); src.stop(t + dur + 0.5);
        } else {
        // Acoustic guitar: triangle harmonics (warm soundboard) + pluck envelope + pick transient
        const dur = 2.2;
        // Pick attack noise
        const aLen = Math.floor(ctx.sampleRate * 0.025);
        const aBuf = ctx.createBuffer(1, aLen, ctx.sampleRate);
        const aData = aBuf.getChannelData(0);
        for (let i = 0; i < aLen; i++)
          aData[i] = (Math.random() * 2 - 1) * Math.exp(-i / aLen * 8);
        const aSrc = ctx.createBufferSource(); aSrc.buffer = aBuf;
        const aFilt = ctx.createBiquadFilter(); aFilt.type = 'bandpass'; aFilt.frequency.value = 2800; aFilt.Q.value = 1.5;
        const aGain = ctx.createGain(); aGain.gain.value = 0.5;
        aSrc.connect(aFilt); aFilt.connect(aGain); wire(aGain); aSrc.start(t);
        // Harmonic series with pluck envelope: instant on, fast 55% drop, slow ring
        ([
          [1,   0.55, dur],
          [2,   0.25, dur * 0.75],
          [3,   0.12, dur * 0.55],
          [4,   0.06, dur * 0.38],
          [5,   0.03, dur * 0.25],
        ] as [number, number, number][]).forEach(([mult, vol, hdur]) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(freq * mult, t);
          g.gain.setValueAtTime(vol, t);
          g.gain.exponentialRampToValueAtTime(vol * 0.45, t + 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, t + hdur);
          o.connect(g); wire(g); o.start(t); o.stop(t + hdur);
        });
        // Body chorus: two slight-detuned voices add room/soundboard resonance
        [-5, 5].forEach(det => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(freq, t); o.detune.setValueAtTime(det, t);
          g.gain.setValueAtTime(0.14, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.85);
          o.connect(g); wire(g); o.start(t); o.stop(t + dur * 0.85);
        });
        } // end synthesis fallback
      }
      else if (inst === 'banjo') {
        // Banjo: sawtooth (all harmonics, bright/metallic) + drum-head resonance + loud pick attack
        const dur = 0.65;
        const ringFilt = ctx.createBiquadFilter();
        ringFilt.type = 'peaking'; ringFilt.frequency.value = 3200; ringFilt.gain.value = 14; ringFilt.Q.value = 2.2;
        const hpFilt = ctx.createBiquadFilter(); hpFilt.type = 'highpass'; hpFilt.frequency.value = 180;
        const outGain = ctx.createGain(); outGain.gain.value = 0.42;
        hpFilt.connect(ringFilt); ringFilt.connect(outGain); wire(outGain);
        // Sawtooth (NOT triangle) — sawtooth has all harmonics giving that bright metallic ring
        const oSaw = ctx.createOscillator(); const gSaw = ctx.createGain();
        oSaw.type = 'sawtooth';
        oSaw.frequency.setValueAtTime(freq * 1.020, t); // 2% sharp on attack
        oSaw.frequency.exponentialRampToValueAtTime(freq, t + 0.012); // snap to pitch
        gSaw.gain.setValueAtTime(0.45, t); gSaw.gain.exponentialRampToValueAtTime(0.001, t + dur);
        oSaw.connect(gSaw); gSaw.connect(hpFilt); oSaw.start(t); oSaw.stop(t + dur);
        // 2nd harmonic body tone (fretboard resonance)
        const oBody = ctx.createOscillator(); const gBody = ctx.createGain();
        oBody.type = 'sine'; oBody.frequency.setValueAtTime(freq * 2 * 1.02, t);
        oBody.frequency.exponentialRampToValueAtTime(freq * 2, t + 0.012);
        gBody.gain.setValueAtTime(0.22, t); gBody.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.55);
        oBody.connect(gBody); gBody.connect(hpFilt); oBody.start(t); oBody.stop(t + dur * 0.55);
        // Loud metallic pick attack (the distinctive banjo snap)
        const pickLen = Math.floor(ctx.sampleRate * 0.007);
        const pickBuf = ctx.createBuffer(1, pickLen, ctx.sampleRate);
        const pd = pickBuf.getChannelData(0);
        for (let i = 0; i < pickLen; i++) pd[i] = (Math.random()*2-1) * Math.exp(-i / pickLen * 9);
        const ps = ctx.createBufferSource(); ps.buffer = pickBuf;
        const pg = ctx.createGain(); pg.gain.value = 0.45; // very loud — this IS the banjo attack
        const pf = ctx.createBiquadFilter(); pf.type = 'highpass'; pf.frequency.value = 5500;
        ps.connect(pf); pf.connect(pg); wire(pg); ps.start(t);
      }
      else if (inst === 'organ') {
        // Hammond drawbar footages: 16'=×0.5, 8'=×1, 4'=×2, 2⅔'=×3, 2'=×4, 1⅗'=×6, 1'=×8
        const drawbars: [number,number][] = [[0.5,0.55],[1,0.8],[2,0.7],[3,0.45],[4,0.40],[6,0.25],[8,0.15]];
        drawbars.forEach(([mult, vol]) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(freq * mult, t);
          g.gain.setValueAtTime(vol * 0.18, t);
          g.gain.setValueAtTime(vol * 0.18, t + 1.8);
          g.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
          o.connect(g); wire(g); o.start(t); o.stop(t + 2.2);
        });
        // Leslie rotary cabinet: LFO at ~6Hz oscillates the detune (not static cents)
        [1, -1].forEach(polarity => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(freq, t);
          const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
          lfo.type = 'sine'; lfo.frequency.value = 6.0;
          lfoG.gain.value = 18 * polarity; // cents peak
          lfo.connect(lfoG); lfoG.connect(o.detune);
          lfo.start(t); lfo.stop(t + 2.2);
          g.gain.setValueAtTime(0.09, t); g.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
          o.connect(g); wire(g); o.start(t); o.stop(t + 2.2);
        });
      }
      else if (inst === 'strings') {
        // Triangle voices (odd harmonics = warmer, bowed-string timbre) + delayed vibrato
        // All voices bused together then through chorus for ensemble width
        const dur = 3.4;
        const strBus = ctx.createGain(); strBus.gain.value = 1.0;
        const detunes = [-14, -7, 0, 7, 14];
        detunes.forEach((det, i) => {
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(freq, t); o.detune.setValueAtTime(det, t);
          const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
          lfo.frequency.value = 5.2 + i * 0.15;
          lfoG.gain.setValueAtTime(0, t); lfoG.gain.linearRampToValueAtTime(freq * 0.007, t + 0.7);
          lfo.connect(lfoG); lfoG.connect(o.frequency);
          lfo.start(t); lfo.stop(t + dur);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.13 - i * 0.01, t + 0.5);
          g.gain.setValueAtTime(0.11, t + 1.8); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          o.connect(g); g.connect(strBus); o.start(t); o.stop(t + dur);
          const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
          o2.type = 'triangle'; o2.frequency.setValueAtTime(freq * 2, t); o2.detune.setValueAtTime(det * 0.5, t);
          g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(0.032, t + 0.9);
          g2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.9);
          o2.connect(g2); g2.connect(strBus); o2.start(t); o2.stop(t + dur * 0.9);
        });
        wireChorus(strBus, dur);
      }
      else if (inst === 'soprano') {
        const sKey = CHOIR_MAP[note];
        const sBuf = sKey ? choirCache.get(sKey) : undefined;
        if (sBuf) {
          const dur = 3.2;
          const src = ctx.createBufferSource(); src.buffer = sBuf;
          src.playbackRate.value = freq / CHOIR_HZ[sKey];
          const env = ctx.createGain();
          env.gain.setValueAtTime(0, t);
          env.gain.linearRampToValueAtTime(0.65, t + 0.12);
          env.gain.setValueAtTime(0.55, t + 0.6);
          env.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(env); wireChorus(env, dur); src.start(t); src.stop(t + dur + 0.3);
        }
      }
      else if (inst === 'vocalOoh') {
        // High notes (F4+): SSO female chorus with ooh formant shaping
        // Low notes (C3–E4): SSO male chorus real recordings
        const femKey = CHOIR_MAP[note];
        const femBuf = femKey ? choirCache.get(femKey) : undefined;
        if (femBuf) {
          const dur = 3.5;
          const src = ctx.createBufferSource(); src.buffer = femBuf;
          src.playbackRate.value = freq / CHOIR_HZ[femKey];
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2800; lp.Q.value = 0.7;
          const f1 = ctx.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 350; f1.gain.value = 7; f1.Q.value = 2.5;
          const ahCut = ctx.createBiquadFilter(); ahCut.type = 'peaking'; ahCut.frequency.value = 1100; ahCut.gain.value = -10; ahCut.Q.value = 2;
          const env = ctx.createGain();
          env.gain.setValueAtTime(0, t);
          env.gain.linearRampToValueAtTime(0.70, t + 0.20);
          env.gain.setValueAtTime(0.58, t + 1.0);
          env.gain.exponentialRampToValueAtTime(0.001, t + dur);
          src.connect(lp); lp.connect(f1); f1.connect(ahCut); ahCut.connect(env);
          wireChorus(env, dur); src.start(t); src.stop(t + dur + 0.3);
        } else {
          const malKey = VOX_MAP[note];
          const malBuf = malKey ? voxCache.get(malKey) : undefined;
          if (malBuf) {
            const dur = 3.2;
            const src = ctx.createBufferSource(); src.buffer = malBuf;
            src.playbackRate.value = freq / VOX_HZ[malKey];
            const env = ctx.createGain();
            env.gain.setValueAtTime(0, t);
            env.gain.linearRampToValueAtTime(0.60, t + 0.18);
            env.gain.setValueAtTime(0.50, t + 0.8);
            env.gain.exponentialRampToValueAtTime(0.001, t + dur);
            src.connect(env); wireChorus(env, dur); src.start(t); src.stop(t + dur + 0.3);
          }
        }
      }
      else if (inst === 'corn') {
        // Each key = a different AI voice shouting "Kernelcon!"
        // Web Speech API — Chrome's Google TTS voices are fetched from Google's servers
        if (cornVoices.length === 0) initCornVoices();
        const keyIndex = ALL_PIANO_KEYS.indexOf(note);
        // Multiply by prime to spread voices so adjacent keys sound distinct
        const voiceIndex = cornVoices.length > 0
          ? (keyIndex * 7) % cornVoices.length
          : 0;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('Kernel-con!');
        if (cornVoices[voiceIndex]) u.voice = cornVoices[voiceIndex];
        u.volume = 1;
        u.rate  = 0.85 + (keyIndex / ALL_PIANO_KEYS.length) * 0.55;
        u.pitch = 0.5  + (keyIndex / ALL_PIANO_KEYS.length) * 1.3;
        window.speechSynthesis.speak(u);
      }
    }

    const display = inst === 'drums'
      ? (DRUM_PADS.find(p => p.id === note)?.name ?? note)
      : note;
    activeNotesRef.current.set(inst, { note: display, birth: Date.now() });

    const instData = INSTRUMENTS.find(i => i.id === inst);
    const col = instData?.color ?? '#39ff14';
    // Spawn particles near the instrument's lane
    const instIdx = INSTRUMENTS.findIndex(i => i.id === inst);
    const laneY = 28 + instIdx * 28 + 14;
    for (let i = 0; i < 6; i++) {
      particlesRef.current.push({
        x: 120 + Math.random() * 900,
        y: laneY + (Math.random() - 0.5) * 16,
        vy: -0.5 - Math.random() * 2.0,
        life: 1, color: col,
      });
    }

    if (record && isRecordingRef.current) {
      recEventsRef.current.push({ note, t: Date.now() - recStartRef.current });
    }
  }, [getCtx, getDest, makeDrum]);

  // Sync tracks into viz ref so the draw loop can read them without deps
  useEffect(() => { tracksVizRef.current = tracks; }, [tracks]);

  useEffect(() => {
    if (instrument !== 'mic') return;
    navigator.mediaDevices?.enumerateDevices().then(devs => {
      const inputs = devs.filter(d => d.kind === 'audioinput');
      setMicDevices(inputs);
      setSelectedMicId(prev => prev || (inputs[0]?.deviceId ?? ''));
    }).catch(() => {});
  }, [instrument]);

  // Per-instrument stream visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;
    let frame = 0;

    // "#rrggbb" → "r,g,b"
    const rgb = (hex: string) => {
      const n = parseInt(hex.replace('#',''), 16);
      return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
    };

    const FADE   = 800;
    const LANE_H = 27;
    const LANE_G = 2;
    const Y0     = 58;
    const NAME_W = 96;
    const NOTE_W = 76;
    const THIN_H = 2;   // canvas height when nothing is loaded

    const draw = () => {
      const W = canvas.width;
      const now = Date.now();
      const trs = tracksVizRef.current;

      // Playhead — update CSS var directly so no re-render needed
      if (playStartRef.current > 0 && loopDurRef.current > 0) {
        const pos = ((now - playStartRef.current) % loopDurRef.current) / loopDurRef.current;
        trackManagerRef.current?.style.setProperty('--play-pos', String(pos));
      }

      // Deduplicate instrument ids from active tracks only — nothing shown when empty
      const seen = new Set<string>();
      const instIds = trs
        .filter(tr => !seen.has(tr.inst) && seen.add(tr.inst) !== undefined)
        .map(tr => tr.inst);

      // Dynamic canvas height: thin when empty, exact fit when loaded
      const desiredH = instIds.length === 0
        ? THIN_H
        : Y0 + instIds.length * (LANE_H + LANE_G) + 6;
      if (canvas.height !== desiredH) canvas.height = desiredH;

      const H = canvas.height;
      c.fillStyle = '#060610';
      c.fillRect(0, 0, W, H);

      if (instIds.length === 0) {
        frame = requestAnimationFrame(draw);
        return;
      }

      // ── Branding header ──────────────────────────────────────────────────
      // Logo (left)
      const logoH = 38, logoW = _logoImg.complete && _logoImg.naturalWidth
        ? Math.round(logoH * _logoImg.naturalWidth / _logoImg.naturalHeight) : 0;
      if (logoW > 0) c.drawImage(_logoImg, 10, 10, logoW, logoH);

      // "Algo(RHYTHM)" — Bebas Neue, coloured segments
      const titleX = logoW ? logoW + 24 : 10;
      c.font = 'bold 32px "Bebas Neue", sans-serif';
      c.shadowBlur = 0; c.globalAlpha = 1;
      c.fillStyle = 'rgba(190,160,255,0.85)';
      const pre = 'Algo('; const preW = c.measureText(pre).width;
      c.fillText(pre, titleX, 42);
      c.fillStyle = '#39ff14';
      c.shadowBlur = 12; c.shadowColor = '#39ff14';
      const rhy = 'RHYTHM'; const rhyW = c.measureText(rhy).width;
      c.fillText(rhy, titleX + preW, 42);
      c.shadowBlur = 0;
      c.fillStyle = 'rgba(190,160,255,0.85)';
      c.fillText(')', titleX + preW + rhyW, 42);

      // Date + location (right-aligned)
      c.font = '10px "Space Mono", monospace';
      c.fillStyle = 'rgba(255,255,255,0.45)';
      c.textAlign = 'right';
      c.fillText('MAR 4–5, 2027', W - 14, 30);
      c.fillText('HILTON DOWNTOWN OMAHA', W - 14, 46);
      c.textAlign = 'left';

      // Separator line
      c.strokeStyle = 'rgba(123,47,255,0.35)';
      c.lineWidth = 1;
      c.beginPath(); c.moveTo(0, Y0 - 4); c.lineTo(W, Y0 - 4); c.stroke();

      // Pre-compute mic analyser data for live waveform drawing
      let micWaveData: Uint8Array | null = null;
      if (micAnalyserRef.current) {
        const buf = new Uint8Array(micAnalyserRef.current.frequencyBinCount);
        micAnalyserRef.current.getByteTimeDomainData(buf);
        const maxDev = buf.reduce((m, v) => Math.max(m, Math.abs(v - 128)), 0);
        if (maxDev > 3) micWaveData = buf;
      }

      instIds.forEach((instId, idx) => {
        const ly = Y0 + idx * (LANE_H + LANE_G);
        const def = INSTRUMENTS.find(d => d.id === instId);
        const col = def?.color ?? '#39ff14';
        const r = rgb(col);
        const entry = activeNotesRef.current.get(instId);
        const age = entry ? now - entry.birth : Infinity;
        let t = age < FADE ? Math.max(0, 1 - age / FADE) : 0;
        if (instId === 'mic' && micWaveData) t = 0.85;

        // Lane background
        c.fillStyle = `rgba(${r},${0.03 + t * 0.11})`;
        c.fillRect(0, ly, W, LANE_H);

        // Left accent bar
        c.fillStyle = col;
        c.globalAlpha = 0.22 + t * 0.78;
        c.fillRect(0, ly, 3, LANE_H);
        c.globalAlpha = 1;

        // Icon + name
        c.font = '10px "Space Mono", monospace';
        c.fillStyle = `rgba(${r},${0.35 + t * 0.65})`;
        c.fillText(`${def?.icon ?? '?'} ${(def?.name ?? instId).toUpperCase()}`, 8, ly + 18);

        // Waveform
        const wx = NAME_W, ww = W - NAME_W - NOTE_W - 8;
        c.strokeStyle = col;
        c.shadowColor = col;
        if (instId === 'mic' && micWaveData) {
          // Real waveform from AnalyserNode
          c.lineWidth = 1.8; c.globalAlpha = 0.88; c.shadowBlur = 10;
          c.beginPath();
          const sw = ww / micWaveData.length;
          for (let i = 0; i < micWaveData.length; i++) {
            const v = (micWaveData[i] / 128.0) - 1;
            const y = ly + LANE_H / 2 + v * (LANE_H / 2 - 3);
            i === 0 ? c.moveTo(wx, y) : c.lineTo(wx + i * sw, y);
          }
          c.stroke();
        } else {
          const amp = t > 0 ? 2 + t * 10 : 1.5;
          const spd = 0.0008 * (idx * 0.4 + 1);
          c.lineWidth = t > 0.1 ? 1.8 : 0.8;
          c.globalAlpha = 0.18 + t * 0.82;
          c.shadowBlur = t * 16;
          c.beginPath();
          for (let x = 0; x <= ww; x += 2) {
            const f = x / ww;
            const wave =
              Math.sin(f * Math.PI * 7  + now * spd)              * amp +
              Math.sin(f * Math.PI * 13 + now * spd * 1.5) * 0.45 * amp +
              Math.sin(f * Math.PI * 3  + now * spd * 0.7) * 0.22 * amp;
            x === 0 ? c.moveTo(wx, ly + LANE_H / 2 + wave) : c.lineTo(wx + x, ly + LANE_H / 2 + wave);
          }
          c.stroke();
        }
        c.shadowBlur = 0;
        c.globalAlpha = 1;

        // Note label (fades out)
        if (entry && t > 0) {
          c.globalAlpha = t;
          c.shadowBlur = 18; c.shadowColor = col;
          c.fillStyle = col;
          c.font = `bold 17px "Bebas Neue", sans-serif`;
          c.fillText(entry.note, W - NOTE_W + 6, ly + 19);
          c.shadowBlur = 0; c.globalAlpha = 1;
        }
      });

      // Particles
      particlesRef.current = particlesRef.current
        .map(p => ({...p, y: p.y + p.vy, life: p.life - 0.022}))
        .filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        c.globalAlpha = p.life * 0.9;
        c.fillStyle = p.color; c.shadowBlur = 10; c.shadowColor = p.color;
        c.beginPath(); c.arc(p.x, p.y, 2.5, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0; c.globalAlpha = 1;
      });

      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Keyboard events
  useEffect(() => {
    const instRef = {current: instrument};
    instRef.current = instrument;
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (instRef.current === 'drums') {
        const pad = DRUM_KB[e.key.toLowerCase()];
        if (!pad) return;
        setPressedKeys(p => new Set([...p, pad]));
        playNote(pad, 'drums');
      } else {
        const note = KB_MAP[e.key.toLowerCase()];
        if (!note) return;
        setPressedKeys(p => new Set([...p, note]));
        playNote(note, instRef.current);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (instRef.current === 'drums') {
        const pad = DRUM_KB[e.key.toLowerCase()];
        if (pad) setPressedKeys(p => { const s = new Set(p); s.delete(pad); return s; });
      } else {
        const note = KB_MAP[e.key.toLowerCase()];
        if (note) setPressedKeys(p => { const s = new Set(p); s.delete(note); return s; });
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [playNote, instrument]);

  const press   = (key: string) => { setPressedKeys(p => new Set([...p, key])); playNote(key, instrument); };
  const release = (key: string) => setPressedKeys(p => { const s = new Set(p); s.delete(key); return s; });

  const scheduleTrack = useCallback((tr: Track) => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const spd = playSpeedRef.current;
    tr.events.forEach(({note, t}) => {
      timers.push(setTimeout(() => playNote(note, tr.inst, false, tr.mods), Math.max(0, t / spd)));
    });
    return timers;
  }, [playNote]);

  const stopAll = useCallback(() => {
    loopTimersRef.current.forEach(clearTimeout);
    loopTimersRef.current = [];
    if (loopIntervalRef.current) { clearInterval(loopIntervalRef.current); loopIntervalRef.current = null; }
    micPlaybackMapRef.current.forEach(pb => {
      pb.audio.pause(); pb.audio.currentTime = 0;
      pb.oscNodes?.forEach(o => { try { o.stop(); } catch {} });
    });
    micPlaybackMapRef.current.clear();
    playStartRef.current = 0;
    trackManagerRef.current?.style.setProperty('--play-pos', '0');
    setIsPlaying(false);
  }, []);

  const playAll = useCallback((trs: Track[]) => {
    stopAll();
    const noteActive = trs.filter(tr => !tr.muted && tr.events.length > 0);
    const audioActive = trs.filter(tr => !tr.muted && !!tr.audioUrl);
    if (!noteActive.length && !audioActive.length) return;
    const maxDur = Math.max(
      ...(noteActive.length ? noteActive.map(tr => tr.dur) : []),
      ...(audioActive.length ? audioActive.map(tr => tr.dur) : []),
      1000
    ) / playSpeedRef.current;
    loopDurRef.current = maxDur;

    const fireMicAudio = () => {
      // Stop and clean up previous playback (including any oscillators)
      micPlaybackMapRef.current.forEach(pb => {
        pb.audio.pause(); pb.audio.currentTime = 0;
        pb.oscNodes?.forEach(o => { try { o.stop(); } catch {} });
      });
      micPlaybackMapRef.current.clear();
      if (!audioActive.length) return;

      // Always ensure AudioContext exists — mic users may never touch the keyboard
      const ctx = ensureAudioCtx(audioCtxRef);
      // Analyser is a monitoring tap only — never connected to destination (prevents feedback)
      if (!micAnalyserRef.current) {
        const a = ctx.createAnalyser(); a.fftSize = 512;
        micAnalyserRef.current = a;
      }
      const analyser = micAnalyserRef.current;

      audioActive.forEach(tr => {
        const mods = tr.micMods ?? DEFAULT_MIC_MODS;
        const audio = new Audio(tr.audioUrl!);
        audio.playbackRate = Math.pow(2, mods.semitones / 12);
        const src = ctx.createMediaElementSource(audio);
        const gainNode = ctx.createGain(); gainNode.gain.value = mods.gain;
        src.connect(gainNode);
        let last: AudioNode = gainNode;
        let filterNode: BiquadFilterNode|undefined;
        const oscNodes: OscillatorNode[] = [];

        if (mods.filter === 'tel') {
          const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1000; f.Q.value = 2;
          last.connect(f); last = f; filterNode = f;
        } else if (mods.filter === 'bass') {
          const f = ctx.createBiquadFilter(); f.type = 'lowshelf'; f.frequency.value = 250; f.gain.value = 12;
          last.connect(f); last = f; filterNode = f;
        } else if (mods.filter === 'bright') {
          const f = ctx.createBiquadFilter(); f.type = 'highshelf'; f.frequency.value = 3500; f.gain.value = 8;
          last.connect(f); last = f; filterNode = f;
        } else if (mods.filter === 'robot') {
          // Ring modulation: carrier oscillator AM-modulates the signal, creating robotic sidebands
          const amGain = ctx.createGain(); amGain.gain.value = 0;
          const oscGain = ctx.createGain(); oscGain.gain.value = 0.7;
          const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 80;
          osc.connect(oscGain); oscGain.connect(amGain.gain);
          last.connect(amGain);
          // Bandpass to sharpen the robotic quality
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 1.2;
          amGain.connect(bp); last = bp;
          osc.start(); oscNodes.push(osc);
        } else if (mods.filter === 'deep') {
          // Heavy bass + high cut + soft saturation for a demon/giant voice
          const ls = ctx.createBiquadFilter(); ls.type = 'lowshelf'; ls.frequency.value = 150; ls.gain.value = 16;
          const hs = ctx.createBiquadFilter(); hs.type = 'highshelf'; hs.frequency.value = 4500; hs.gain.value = -14;
          const ws = ctx.createWaveShaper();
          (ws as { curve: Float32Array | null }).curve = makeDistortionCurve(80) as unknown as Float32Array;
          last.connect(ls); ls.connect(hs); hs.connect(ws); last = ws; filterNode = ls;
        }

        let delayNode: DelayNode|undefined;
        if (mods.echo) {
          const d = ctx.createDelay(1.0); d.delayTime.value = mods.echoMs / 1000;
          const fb = ctx.createGain(); fb.gain.value = 0.4;
          const wet = ctx.createGain(); wet.gain.value = 0.55;
          const dry = ctx.createGain(); dry.gain.value = 0.75;
          // Output goes to destination; analyser taps in as side branch (no feedback)
          last.connect(dry); dry.connect(ctx.destination); dry.connect(analyser);
          last.connect(d); d.connect(fb); fb.connect(d);
          d.connect(wet); wet.connect(ctx.destination); wet.connect(analyser);
          delayNode = d;
        } else {
          last.connect(ctx.destination);
          last.connect(analyser);
        }
        audio.play().catch(() => {});
        micPlaybackMapRef.current.set(tr.id, {audio, gainNode, filterNode, delayNode, oscNodes: oscNodes.length ? oscNodes : undefined});
      });
    };

    const fireNotes = () => noteActive.forEach(tr => loopTimersRef.current.push(...scheduleTrack(tr)));
    playStartRef.current = Date.now();
    setIsPlaying(true);
    fireMicAudio();
    fireNotes();
    loopIntervalRef.current = setInterval(() => {
      loopTimersRef.current.forEach(clearTimeout); loopTimersRef.current = [];
      fireMicAudio(); fireNotes();
    }, maxDur);
  }, [stopAll, scheduleTrack]);

  const addChunk = (id: number) => {
    const updated = tracks.map(t => {
      if (t.id !== id) return t;
      const base = t.events.filter(e => e.t < t.baseDur);
      const extra = base.map(e => ({...e, t: e.t + t.dur}));
      return {...t, events: [...t.events, ...extra], dur: t.dur + t.baseDur, chunks: t.chunks + 1};
    });
    setTracks(updated);
    if (isPlaying) playAll(updated);
  };

  const removeChunk = (id: number) => {
    const updated = tracks.map(t => {
      if (t.id !== id || t.chunks <= 1) return t;
      const newDur = t.dur - t.baseDur;
      return {...t, events: t.events.filter(e => e.t < newDur), dur: newDur, chunks: t.chunks - 1};
    });
    setTracks(updated);
    if (isPlaying) playAll(updated);
  };

  const startMicRecord = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = stream;
      micChunksRef.current = [];
      // Route stream through analyser for live visualizer — NOT to destination (prevents feedback)
      const ctx = ensureAudioCtx(audioCtxRef);
      if (!micAnalyserRef.current) {
        const a = ctx.createAnalyser(); a.fftSize = 512;
        micAnalyserRef.current = a;
      }
      const src = ctx.createMediaStreamSource(stream);
      src.connect(micAnalyserRef.current);
      micStreamSrcRef.current = src;
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) micChunksRef.current.push(e.data); };
      mediaRecorderRef.current = mr;
      recInstRef.current = 'mic';
      recStartRef.current = Date.now();
      isRecordingRef.current = true;
      setIsRecording(true);
      mr.start();
      const devs = await navigator.mediaDevices.enumerateDevices();
      setMicDevices(devs.filter(d => d.kind === 'audioinput'));
    } catch {
      setToast('Microphone access denied or unavailable');
    }
  };

  const stopMicRecord = () => {
    const dur = Date.now() - recStartRef.current;
    isRecordingRef.current = false; setIsRecording(false); stopAll();
    micStreamSrcRef.current?.disconnect(); micStreamSrcRef.current = null;
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    mr.onstop = () => {
      const blob = new Blob(micChunksRef.current, { type: mr.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const trackDur = Math.max(dur, 500);
      setTracks(prev => [...prev, {
        id: ++trackIdRef.current, inst: 'mic', events: [],
        audioUrl: url, dur: trackDur, baseDur: trackDur, chunks: 1, muted: false,
        micMods: {...DEFAULT_MIC_MODS},
      }]);
      setActiveDemo(null);
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      micStreamRef.current = null; mediaRecorderRef.current = null;
    };
    mr.stop();
  };

  const startOverdub = async () => {
    if (instrument === 'mic') { playAll(tracks); await startMicRecord(); return; }
    playAll(tracks);
    recEventsRef.current = []; recInstRef.current = instrument;
    recStartRef.current = Date.now(); isRecordingRef.current = true;
    setIsRecording(true);
  };

  const updateMicMod = (id: number, mods: Partial<MicMods>) => {
    const updated = tracks.map(t => {
      if (t.id !== id) return t;
      return {...t, micMods: {...(t.micMods ?? DEFAULT_MIC_MODS), ...mods}};
    });
    setTracks(updated);
    const pb = micPlaybackMapRef.current.get(id);
    if (pb) {
      // Live pitch update — instant
      if (mods.semitones !== undefined) {
        pb.audio.playbackRate = Math.pow(2, mods.semitones / 12);
      }
      // Live gain update — instant
      if (mods.gain !== undefined && pb.gainNode) {
        pb.gainNode.gain.value = mods.gain;
      }
      // Live echo delay update — instant
      if (mods.echoMs !== undefined && pb.delayNode) {
        pb.delayNode.delayTime.value = mods.echoMs / 1000;
      }
      // Filter / echo on-off changes need re-routing — restart playback
      if ((mods.filter !== undefined || mods.echo !== undefined) && loopIntervalRef.current !== null) {
        playAll(updated);
      }
    }
  };

  const updateTrackMods = (id: number, patch: Partial<TrackMods>) => {
    const updated = tracks.map(t => t.id === id
      ? {...t, mods: {...DEFAULT_TRACK_MODS, ...t.mods, ...patch} as TrackMods}
      : t
    );
    setTracks(updated);
    if (isPlaying) playAll(updated);
  };

  const scrollDemos = (dir: number) => {
    demoScrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const loadExample = (ex: Example) => {
    stopAll();
    let id = trackIdRef.current;
    setTracks(ex.tracks.map(tr => ({
      id: ++id, inst: tr.inst, events: tr.events, dur: ex.dur, baseDur: ex.dur, chunks: 1, muted: false,
    })));
    trackIdRef.current = id;
    loopDurRef.current = ex.dur;
    setActiveDemo(ex.name);
  };

  const startRecord = async () => {
    if (instrument === 'mic') { await startMicRecord(); return; }
    recEventsRef.current = []; recInstRef.current = instrument;
    recStartRef.current = Date.now(); isRecordingRef.current = true;
    setIsRecording(true);
  };

  const stopRecord = () => {
    if (recInstRef.current === 'mic') { stopMicRecord(); return; }
    const dur = Date.now() - recStartRef.current;
    isRecordingRef.current = false; setIsRecording(false); stopAll();
    if (!recEventsRef.current.length) return;
    const trackDur = Math.max(dur, 500);
    setTracks(prev => [...prev, {
      id: ++trackIdRef.current, inst: recInstRef.current,
      events: [...recEventsRef.current], dur: trackDur, baseDur: trackDur, chunks: 1, muted: false,
    }]);
    setActiveDemo(null);
  };

  const captureVideo = (target: 'share'|'tweet'|'linkedin' = 'share', onDone?: (url: string) => void) => {
    const canvas = canvasRef.current;
    if (!canvas || !tracks.some(tr => !tr.muted)) return;
    setExportingFor(target);
    const dest = getDest();
    const combined = new MediaStream([
      ...canvas.captureStream(30).getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus' : 'video/webm';
    const recorder = new MediaRecorder(combined, {mimeType: mime});
    chunksRef.current = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      stopAll();
      setExportingFor(null);
      const url = URL.createObjectURL(new Blob(chunksRef.current, {type: 'video/webm'}));
      if (onDone) {
        onDone(url);
      } else {
        setVideoUrl(url);
        setShareOpen(true);
      }
    };
    recorder.start();
    tracks.filter(tr => !tr.muted).forEach(tr => loopTimersRef.current.push(...scheduleTrack(tr)));
    setTimeout(() => {
      recorder.stop();
      loopTimersRef.current.forEach(clearTimeout); loopTimersRef.current = [];
    }, loopDurRef.current + 400);
  };

  const tweetLoop = (url?: string | null) => {
    if (url) {
      const a = document.createElement('a'); a.href = url;
      a.download = 'kernelcon-algo-rhythm-loop.webm'; a.click();
    }
    const text = encodeURIComponent('I just composed a loop at Kernelcon 2027 Algo(Rhythm)! 🎵 Attach your downloaded video and tag us! #KernelCon2027 #AlgoRhythm @_kernelcon_');
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const linkedInShare = (url?: string | null) => {
    const text = 'I just composed a loop at Kernelcon 2027 Algo(Rhythm)! 🎵 #KernelCon2027 #AlgoRhythm kernelcon.org';
    navigator.clipboard.writeText(text).catch(() => {});
    if (url) {
      const a = document.createElement('a'); a.href = url;
      a.download = 'kernelcon-algo-rhythm-loop.webm'; a.click();
    }
    window.open('https://www.linkedin.com/feed/', '_blank');
    showToast(url ? 'Video downloaded · Share text copied — paste on LinkedIn to post!' : 'Share text copied — paste on LinkedIn to post!');
  };

  return (
    <div className="rhythm-section piano-section">
      <div className="rhythm-inner">
        <div className="rhythm-label">Interactive // Compose a Beat</div>
        <h2 className="rhythm-title">PLAY THE <span className="accent-green">SYSTEM</span></h2>
        <p className="piano-tagline">
          Every conference has a soundtrack. This one has yours. Layer instruments, build a loop,
          and record something no algorithm could predict. Load a demo to start, or start from silence.
          Either way, you're composing at Kernelcon.
        </p>
        <p className="piano-subtitle">
          {instrument === 'drums'
            ? '♪ Z=Kick  X=Snare  C=Hi-Hat  V=Tom  B=Clap  N=Cymbal  |  Click pads to play'
            : instrument === 'mic'
            ? '🎙 Select your input device, then hit Record Layer or Overdub to capture audio'
            : '♪ White: Q-U = C3-B3 · A-K = C4-C5 | Black: 1-5 = C#3-A#3 · 6-0 = C#4-A#4 | Layer instruments'}
        </p>

        {/* Example loops */}
        <div className="example-strip">
          <div className="example-strip-header">
            <span className="example-strip-label">▶ DEMO LOOPS</span>
            <div className="example-strip-controls">
              <div className="speed-control">
                <span className="speed-label">Speed</span>
                <input type="range" className="speed-slider" min={0.25} max={2} step={0.05}
                  value={playSpeed}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setPlaySpeed(v); playSpeedRef.current = v;
                    if (isPlaying) playAll(tracks);
                  }} />
                <span className="speed-val">{playSpeed === 1 ? '1×' : playSpeed.toFixed(2) + '×'}</span>
              </div>
              {!isPlaying
                ? <button className="piano-btn play" onClick={() => playAll(tracks)} disabled={tracks.length === 0}>▶ Play Loop</button>
                : <button className="piano-btn stop-play" onClick={stopAll}>⏸ Stop</button>
              }
            </div>
          </div>
          <div className="example-carousel">
            <button className="carousel-arrow carousel-arrow-left" onClick={() => scrollDemos(-1)} aria-label="Scroll left">◀</button>
            <div className="example-cards-row" ref={demoScrollRef}>
              {EXAMPLES.map(ex => {
                const metaMatch = ex.desc.match(/^(.*?)\s*·\s*(\d+ BPM\s*·\s*\d+s)$/);
                const descText = metaMatch ? metaMatch[1] : ex.desc;
                const metaText = metaMatch ? metaMatch[2] : '';
                return (
                  <button key={ex.name} className={`example-card${activeDemo === ex.name ? ' active' : ''}`} onClick={() => loadExample(ex)}>
                    <span className="example-info">
                      <span className="example-title-row">
                        <span className="example-emoji">{ex.emoji}</span>
                        <span className="example-name">{ex.name}</span>
                      </span>
                      <span className="example-desc">{descText}</span>
                      <span className="example-bottom-row">
                        <span className="example-insts">
                          {ex.tracks.map(tr => INSTRUMENTS.find(i => i.id === tr.inst)?.icon).join(' ')}
                        </span>
                        {metaText && <span className="example-meta">{metaText}</span>}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button className="carousel-arrow carousel-arrow-right" onClick={() => scrollDemos(1)} aria-label="Scroll right">▶</button>
          </div>
        </div>

        {/* Instrument selector */}
        <div className="inst-selector">
          {INSTRUMENTS.map(inst => (
            <button key={inst.id}
              className={`inst-btn ${instrument === inst.id ? 'active' : ''}`}
              style={{'--inst-color': inst.color} as React.CSSProperties}
              title={inst.name}
              onClick={() => setInstrument(inst.id)}>
              <span className="inst-icon">{inst.icon}</span>
              {inst.id !== 'corn' && <span className="inst-name">{inst.name}</span>}
            </button>
          ))}
        </div>

        {/* Waveform canvas — collapsed when no tracks */}
        <canvas ref={canvasRef} className="piano-canvas" width={1200} height={2}
          style={tracks.length === 0 && !isRecording && !isExporting ? {height:0, border:'none', marginBottom:0} : undefined} />

        {/* Mic input selector */}
        {instrument === 'mic' && (
          <div className="mic-input-area">
            <div className="mic-input-row">
              <label className="mic-label" htmlFor="mic-device-select">🎙 Input Device</label>
              <select
                id="mic-device-select"
                className="mic-device-select"
                value={selectedMicId}
                onChange={e => setSelectedMicId(e.target.value)}
              >
                {micDevices.length === 0
                  ? <option value="">Default Microphone</option>
                  : micDevices.map(d => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microphone ${d.deviceId.slice(0, 6)}`}
                      </option>
                    ))
                }
              </select>
            </div>
            {isRecording && (
              <div className="mic-recording-status">
                <span className="mic-rec-dot" /> Recording from mic — press Stop when done
              </div>
            )}
          </div>
        )}

        {/* Drum pads OR keyboard (hidden for mic) */}
        {instrument !== 'mic' && (instrument === 'drums' ? (
          <div className="drum-pads">
            {DRUM_PADS.map(pad => (
              <button key={pad.id}
                className={`drum-pad ${pressedKeys.has(pad.id) ? 'active' : ''}`}
                style={{'--pad-color': pad.color} as React.CSSProperties}
                onMouseDown={() => press(pad.id)} onMouseUp={() => release(pad.id)}
                onTouchStart={e => { e.preventDefault(); press(pad.id); }} onTouchEnd={() => release(pad.id)}>
                <span className="pad-name">{pad.name}</span>
                <span className="pad-key">{pad.key}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="piano-keyboard-wrapper">
            <div className="piano-keyboard">
              {(() => {
                const allKeys = [...WHITE_KEYS, ...BLACK_KEYS.map(k => k.note)];
                const disabledKeys = instrument === 'soprano'
                  ? new Set(allKeys.filter(n => !CHOIR_MAP[n]))
                  : new Set<string>(); // vocalOoh covers full range; all other instruments play every key
                return (<>
                  {WHITE_KEYS.map(note => {
                    const off = disabledKeys.has(note);
                    return (
                      <div key={note} className={`piano-white-key ${pressedKeys.has(note) ? 'pressed' : ''} ${off ? 'key-disabled' : ''}`}
                        onMouseDown={() => !off && press(note)} onMouseUp={() => release(note)} onMouseLeave={() => release(note)}
                        onTouchStart={e => { e.preventDefault(); if (!off) press(note); }} onTouchEnd={() => release(note)}>
                        <span className="key-label">{note}</span>
                        <span className="key-kb">{Object.entries(KB_MAP).find(([,v]) => v === note)?.[0]?.toUpperCase() ?? ''}</span>
                      </div>
                    );
                  })}
                  {BLACK_KEYS.map(({note, left}) => {
                    const off = disabledKeys.has(note);
                    return (
                      <div key={note} className={`piano-black-key ${pressedKeys.has(note) ? 'pressed' : ''} ${off ? 'key-disabled' : ''}`}
                        style={{left: `${left}px`}}
                        onMouseDown={e => { e.stopPropagation(); if (!off) press(note); }} onMouseUp={() => release(note)} onMouseLeave={() => release(note)}
                        onTouchStart={e => { e.preventDefault(); e.stopPropagation(); if (!off) press(note); }} onTouchEnd={() => release(note)}>
                        <span className="key-kb">{Object.entries(KB_MAP).find(([,v]) => v === note)?.[0]?.toUpperCase() ?? ''}</span>
                        <span className="key-label">{note.replace(/\d/g,'').replace('#','♯')}</span>
                      </div>
                    );
                  })}
                </>);
              })()}
            </div>
          </div>
        ))}

        {/* Track manager */}
        {tracks.length > 0 && (
          <div className="track-manager" ref={trackManagerRef}>
            <div className="track-manager-label">▶ TRACKS</div>
            {(() => {
              const maxLoopDur = Math.max(...tracks.map(t => t.dur), 1);
              return tracks.map((tr) => {
                const inst = INSTRUMENTS.find(ii => ii.id === tr.inst);
                return (
                  <div key={tr.id} className={`studio-track ${tr.muted ? 'muted' : ''}${tr.audioUrl ? ' mic-track' : ''}`}
                    style={{'--track-color': inst?.color ?? '#39ff14'} as React.CSSProperties}>
                    {/* Main row */}
                    <div className="studio-track-main">
                      <span className="studio-track-icon">{inst?.icon}</span>
                      <span className="studio-track-name">{inst?.name}</span>
                      <div className="track-chunks-bar" title={`${tr.chunks} chunk${tr.chunks !== 1 ? 's' : ''} · ${(tr.dur/1000).toFixed(1)}s`}>
                        {isPlaying && <div className="track-playhead" />}
                        {Array.from({length: tr.chunks}).map((_, i) => (
                          <div key={i} className="track-chunk" style={{width: `${(tr.baseDur / maxLoopDur) * 100}%`}} />
                        ))}
                      </div>
                      <div className="track-btn-group">
                        <button className="studio-track-btn" data-tip={tr.muted ? 'Unmute' : 'Mute'} onClick={() => {
                          const updated = tracks.map(t => t.id === tr.id ? {...t, muted: !t.muted} : t);
                          setTracks(updated);
                          if (isPlaying) playAll(updated);
                        }}>
                          {tr.muted ? '🔇' : '🔊'}
                        </button>
                        {!tr.audioUrl && <button className="studio-track-btn add-chunk" data-tip="Add chunk" onClick={() => addChunk(tr.id)}>+</button>}
                        {!tr.audioUrl && <button className="studio-track-btn remove-chunk" data-tip="Remove chunk" onClick={() => removeChunk(tr.id)} disabled={tr.chunks <= 1}>−</button>}
                        <button className={`studio-track-btn edit${openEditors.has(tr.id) ? ' active' : ''}`} data-tip="Edit" onClick={() => setOpenEditors(p => { const s = new Set(p); s.has(tr.id) ? s.delete(tr.id) : s.add(tr.id); return s; })}>✎</button>
                        <button className="studio-track-btn delete" data-tip="Delete" onClick={() => { stopAll(); setTracks(p => p.filter(t => t.id !== tr.id)); setActiveDemo(null); }}>✕</button>
                      </div>
                    </div>
                    {/* Track editor accordion */}
                    {openEditors.has(tr.id) && !tr.audioUrl && (() => {
                      const m = tr.mods ?? DEFAULT_TRACK_MODS;
                      const upd = (p: Partial<TrackMods>) => updateTrackMods(tr.id, p);
                      const panV = m.pan === 0 ? 'C' : m.pan > 0 ? `R${Math.round(m.pan*100)}` : `L${Math.round(-m.pan*100)}`;
                      const freqV = m.filterFreq >= 1000 ? (m.filterFreq/1000).toFixed(1)+'k' : m.filterFreq+'';
                      return (
                        <div className="track-editor-accordion">
                          <div className="track-editor-row">
                            <span className="track-editor-label">Pitch</span>
                            <input type="range" className="track-editor-slider" min={-24} max={24} step={1} value={m.semitones} onChange={e => upd({semitones: +e.target.value})} />
                            <span className="track-editor-val">{(m.semitones > 0 ? '+' : '') + m.semitones}st</span>
                            <span className="track-editor-label">Vol</span>
                            <input type="range" className="track-editor-slider" min={0} max={2} step={0.05} value={m.gain} onChange={e => upd({gain: +e.target.value})} />
                            <span className="track-editor-val">{Math.round(m.gain * 100)}%</span>
                            <span className="track-editor-label">Pan</span>
                            <input type="range" className="track-editor-slider" min={-1} max={1} step={0.05} value={m.pan} onChange={e => upd({pan: +e.target.value})} />
                            <span className="track-editor-val">{panV}</span>
                          </div>
                          <div className="track-editor-row">
                            <span className="track-editor-label">Filter</span>
                            <div className="track-editor-pills">
                              {(['none','lowpass','highpass','bandpass'] as const).map(ft => (
                                <button key={ft} className={`track-editor-pill${m.filterType === ft ? ' active' : ''}`} onClick={() => upd({filterType: ft})}>
                                  {ft === 'none' ? 'Off' : ft === 'lowpass' ? 'Low' : ft === 'highpass' ? 'High' : 'Band'}
                                </button>
                              ))}
                            </div>
                            {m.filterType !== 'none' && <>
                              <span className="track-editor-label">Cutoff</span>
                              <input type="range" className="track-editor-slider" min={80} max={18000} step={10} value={m.filterFreq} onChange={e => upd({filterFreq: +e.target.value})} />
                              <span className="track-editor-val">{freqV}</span>
                            </>}
                          </div>
                          <div className="track-editor-row">
                            <span className="track-editor-label">Echo</span>
                            <button className={`track-editor-pill${m.echo ? ' active' : ''}`} onClick={() => upd({echo: !m.echo})}>{m.echo ? 'On' : 'Off'}</button>
                            {m.echo && <>
                              <span className="track-editor-label">Delay</span>
                              <input type="range" className="track-editor-slider" min={50} max={800} step={10} value={m.echoMs} onChange={e => upd({echoMs: +e.target.value})} />
                              <span className="track-editor-val">{m.echoMs}ms</span>
                            </>}
                            <span className="track-editor-label">Reverb</span>
                            <input type="range" className="track-editor-slider" min={0} max={1} step={0.05} value={m.reverb} onChange={e => upd({reverb: +e.target.value})} />
                            <span className="track-editor-val">{Math.round(m.reverb * 100)}%</span>
                          </div>
                        </div>
                      );
                    })()}
                    {/* Mic modifier row */}
                    {tr.audioUrl && tr.micMods && (
                      <div className="mic-track-mods">
                        <span className="mic-mod-label">Pitch</span>
                        <div className="mic-mod-pitch">
                          <input type="range" className="mic-pitch-slider" min={-24} max={24} step={1}
                            value={tr.micMods.semitones}
                            onChange={e => updateMicMod(tr.id, {semitones: Number(e.target.value)})} />
                          <span className="mic-pitch-val">{(tr.micMods.semitones > 0 ? '+' : '') + tr.micMods.semitones}st</span>
                        </div>
                        <span className="mic-mod-label">Vol</span>
                        <input type="range" className="mic-gain-slider" min={0} max={2} step={0.05}
                          value={tr.micMods.gain}
                          onChange={e => updateMicMod(tr.id, {gain: Number(e.target.value)})} />
                        <span className="mic-mod-label">Tone</span>
                        {(['none','tel','bass','bright','robot','deep'] as const).map(f => (
                          <button key={f}
                            className={`mic-filter-pill ${tr.micMods?.filter === f ? 'active' : ''}`}
                            onClick={() => updateMicMod(tr.id, {filter: f})}>
                            {f === 'none' ? 'Dry' : f === 'tel' ? 'Tel' : f === 'bass' ? 'Bass' : f === 'bright' ? 'Air' : f === 'robot' ? 'Robot' : 'Deep'}
                          </button>
                        ))}
                        <button className={`mic-filter-pill ${tr.micMods.echo ? 'active' : ''}`}
                          onClick={() => updateMicMod(tr.id, {echo: !tr.micMods?.echo})}>Echo</button>
                        {tr.micMods.echo && (
                          <input type="range" className="mic-echo-slider" min={50} max={500} step={25}
                            value={tr.micMods.echoMs}
                            onChange={e => updateMicMod(tr.id, {echoMs: Number(e.target.value)})} />
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Transport controls */}
        <div className="piano-controls">
          {!isRecording ? (
            <>
              <span className="piano-btn-tip" data-tip="Play notes on the keyboard to add a new layer on top of your existing tracks">
                <button className="piano-btn rec" onClick={startRecord}>⏺ Record Layer</button>
              </span>
              {tracks.length > 0 && (
                <span className="piano-btn-tip" data-tip="Play all tracks while you record a new layer on top — hear the loop as you play">
                  <button className="piano-btn overdub" onClick={startOverdub}>◉ Overdub</button>
                </span>
              )}
            </>
          ) : (
            <button className="piano-btn stop-rec" onClick={stopRecord}>⏹ Stop Recording</button>
          )}
          {tracks.length > 0 && !isRecording && (
            <>
              {!isPlaying
                ? <button className="piano-btn play" onClick={() => playAll(tracks)}>▶ Play Loop</button>
                : <button className="piano-btn stop-play" onClick={stopAll}>⏸ Stop</button>}
              <button className="piano-btn capture" onClick={() => captureVideo('share')} disabled={isPlaying || isRecording || isExporting}>
                {exportingFor === 'share' ? '⏳ Exporting…' : '⬆ Export & Share'}
              </button>
            </>
          )}
        </div>

        {/* Share strip — always visible */}
        <div className="piano-share-strip">
          <div className="share-strip-message">
            <span className="share-strip-label">🎵 DROP YOUR BEAT</span>
            <span className="share-strip-body">
              Built something that hits? Share it. Kernelcon is listening, and the beats that
              impress us most might just earn some serious recognition: prizes, swag, maybe even
              a free pass to the conference. Tag&nbsp;<strong>@_kernelcon_</strong> and let the community
              decide what slaps.
            </span>
          </div>
          <div className="share-strip-actions">
            <button className="piano-btn tweet" onClick={() => captureVideo('tweet', url => tweetLoop(url))} disabled={isPlaying || isRecording || isExporting || tracks.length === 0}>
              {exportingFor === 'tweet' ? '⏳ Recording…' : '𝕏 Tweet to Kernelcon'}
            </button>
            <button className="piano-btn linkedin" onClick={() => captureVideo('linkedin', url => linkedInShare(url))} disabled={isPlaying || isRecording || isExporting || tracks.length === 0}>
              {exportingFor === 'linkedin' ? '⏳ Recording…' : 'in Share on LinkedIn'}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && <div className="piano-toast">{toast}</div>}

        {/* Export & Share modal */}
        {shareOpen && videoUrl && (
          <div className="share-modal-overlay" onClick={() => setShareOpen(false)}>
            <div className="share-modal" onClick={e => e.stopPropagation()}>
              <div className="share-modal-header">
                <span className="share-modal-label">⬆ YOUR LOOP</span>
                <button className="share-modal-close" onClick={() => setShareOpen(false)}>✕</button>
              </div>
              <video src={videoUrl} controls className="share-modal-video" />
              <div className="share-modal-actions">
                <button className="piano-btn download" onClick={() => {
                  const a = document.createElement('a'); a.href = videoUrl;
                  a.download = 'kernelcon-algo-rhythm-loop.webm'; a.click();
                }}>⬇ Download</button>
                <button className="piano-btn tweet" onClick={() => tweetLoop(videoUrl)}>𝕏 Tweet to Kernelcon</button>
                <button className="piano-btn linkedin" onClick={() => linkedInShare(videoUrl)}>in LinkedIn</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FAQ ACCORDION ─────────────────────────────────────────────────────────────

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <div className="rhythm-section faq-section">
      <div className="rhythm-inner faq-inner">
        <div className="faq-header">
          <div className="rhythm-label">Help Desk</div>
          <h2 className="rhythm-title"><span className="accent-yellow">FAQ</span></h2>
          <p className="faq-desc">Read the fine print before the show starts.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div key={i} className={`faq-item ${openIdx === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-icon">{openIdx === i ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: openIdx === i ? '300px' : '0' }}>
                <div className="faq-answer-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

interface HomeState { mode: string; }

export default class Home extends Component<object, HomeState> {
  static displayName = "Home";

  constructor(props: object) {
    super(props);
    this.state = { mode: "" };
  }

  render() {
    return (
      <div id="main_hero" className="hero">
        <BackGround />

        <div className="home-rhythm-sections">

          {/* ── TRACKLIST ── */}
          <div className="rhythm-section tracklist-section">
            <div className="rhythm-inner">
              <div className="section-header">
                <div>
                  <div className="rhythm-label">Mark Your Calendar</div>
                  <h2 className="rhythm-title">UPCOMING <span className="accent-yellow">DATES</span></h2>
                </div>
                <div className="now-playing">▶ MAR 4–5 · OMAHA, NE</div>
              </div>
              <div className="track-list">
                {getKeyDateStatuses().map((d) => (
                  <div key={d.num} className={`track-item track-${d.status}`}>
                    <div className="track-num">{d.num}</div>
                    <div className="track-date">{d.date}</div>
                    <div className="track-names">
                      <div className="track-title">{d.title}</div>
                      <div className="track-sub">{d.sub}</div>
                    </div>
                    <div className={`track-status status-${d.status}`}>
                      {d.status === "finale" ? "★ PLAYING" : d.status === "done" ? "DONE" : "UPCOMING"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />

          {/* ── HEADLINERS ── (commented out until speakers are announced)
          <div className="rhythm-section headliners-section">
            <div className="rhythm-inner">
              <div className="rhythm-label">Keynote Speakers</div>
              <h2 className="rhythm-title">HEAD<span className="accent-pink">LINERS</span></h2>

              <div className="headliner-grid">
                {KEYNOTES.map((k) => (
                  <div key={k.name} className="headliner-card">
                    <div className="headliner-badge">★ {k.badge}</div>
                    <div className="headliner-name">{k.name}</div>
                    <div className="headliner-org">{k.org}</div>
                    <div className="headliner-bg-text">K/N</div>
                  </div>
                ))}
              </div>

              <div className="performers-label">♪ Featured Performers</div>
              <div className="performers-grid">
                {PERFORMERS.map((p) => (
                  <div key={p.name} className="performer-card">
                    <div className="performer-name">{p.name}</div>
                    <div className="performer-track">{p.track}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />
          */}

          {/* ── SOUNDCHECK / TRAINING ── (hidden until training is announced)
          <div className="rhythm-section soundcheck-section">
            <div className="rhythm-inner soundcheck-inner">
              <div className="soundcheck-header">
                <div className="rhythm-label">Training // March 2-3</div>
                <h2 className="rhythm-title">SOUND<br /><span className="accent-yellow">CHECK</span></h2>
                <p className="soundcheck-desc">
                  Before the main show, sharpen your skills in our intensive master classes.
                  Two full days of hands-on workshops with elite instructors.
                  These fill up fast. Book early.
                </p>
                <div className="soundcheck-meta">
                  ♪ MARCH 2–3, 2027<br />
                  ♪ HILTON OMAHA<br />
                  ♪ SEPARATE TICKET REQUIRED<br />
                  ♪ LIMITED CAPACITY
                </div>
              </div>
              <div className="workshop-list">
                {TRAININGS.map((t) => (
                  <div key={t.num} className="workshop-item">
                    <div className="workshop-num">{t.num}</div>
                    <div>
                      <div className="workshop-title">{t.title}</div>
                      <div className="workshop-instructor">{t.instructor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />
          */}

          {/* ── THE CHANNELS ── */}
          <div className="rhythm-section stages-section">
            <div className="rhythm-inner">
              <div className="rhythm-label">Hands-On All Weekend</div>
              <h2 className="rhythm-title">VILLAGES <span className="accent-purple">&amp; AREAS</span></h2>
              <div className="stages-grid">
                {STAGES.map((s) => (
                  <div key={s.name} className="stage-card">
                    <span className="stage-icon">{s.icon}</span>
                    <div className="stage-name">{s.name}</div>
                    <div className="stage-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />

          {/* ── MAIN STAGE / EVENTS ── (hidden until events are announced)
          <div className="rhythm-section main-stage-section">
            <div className="rhythm-inner">
              <div className="rhythm-label">Entertainment</div>
              <h2 className="rhythm-title">MAIN <span className="accent-green">STAGE</span></h2>
              <div className="events-grid">
                {EVENTS.map((ev) => (
                  <div key={ev.name} className={`event-card event-${ev.accent}`}>
                    <div className="event-date">{ev.date}</div>
                    <div className="event-name">{ev.name.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</div>
                    <div className="event-tagline">{ev.tagline}</div>
                    <div className="event-desc">{ev.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />
          */}

          {/* ── BATTLE MODE ── */}
          <div className="rhythm-section battle-section">
            <div className="rhythm-inner">
              <div className="rhythm-label">Test Your Skills</div>
              <h2 className="rhythm-title"><span className="accent-pink">COMPETITIONS</span></h2>
              <div className="battle-grid">
                {BATTLES.map((b) => (
                  <div key={b.name} className={`battle-card battle-${b.color}`}>
                    <div className="battle-tag">{b.tag}</div>
                    <div className="battle-name">{b.name}</div>
                    <div className="battle-motto">{b.motto}</div>
                    <div className="battle-desc">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />

          {/* ── PLAY THE SYSTEM (Piano) ── */}
          <PianoSection />

          <div className="rhythm-stripe" />

          {/* ── REGISTER CTA ── */}
          <div className="rhythm-section cta-section">
            <div className="rhythm-inner cta-inner">
              <div className="cta-content">
                <div className="rhythm-label">March 4–5, 2027 · Omaha</div>
                <h2 className="rhythm-title"><span className="accent-green">REGISTER</span></h2>
                <p className="cta-desc">
                  Secure your spot at the Midwest's most electric cybersecurity event.
                  Registration is live. Slots are finite. The show doesn't wait.
                </p>
                <ul className="cta-perks">
                  <li>Group discounts available for 10 or more</li>
                  <li>Kids under 14 free with a paid adult</li>
                  <li>Cash at the door. No excuses.</li>
                  <li>Passes are transferable (no refunds)</li>
                  <li>Training sold separately. Mar 2-3.</li>
                </ul>
                <a href="https://reg.kernelcon.org" target="_blank" rel="noopener noreferrer" className="cta-button">▶ Register Now</a>
              </div>
              <div className="cta-details">
                <div className="cta-detail-title">EVENT DETAILS</div>
                <ul className="cta-detail-list">
                  <li>Hilton Omaha, Omaha, Nebraska</li>
                  <li>Training: March 2–3, 2027</li>
                  <li>Conference: March 4–5, 2027</li>
                  <li>Hotel block available. Book early.</li>
                  <li>Student discounts available</li>
                  <li>Community-driven pricing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rhythm-stripe" />

          {/* ── FAQ / LINER NOTES ── */}
          <FaqSection />

          {/* ── EQ FOOTER STRIP ── */}
          <div className="rhythm-eq-footer">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="footer-eq-bar" />
            ))}
          </div>

        </div>
      </div>
    );
  }
}
