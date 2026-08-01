import { Component } from 'react';
import Individuals from './Individuals';
import './Speakers.scss';

// import { agendaConfig as config } from '../../../content';
import { speakerConfig as config } from '../../../content';

interface SpeakerAuthor {
  name: string;
  speaker_id?: string;
  talk_id?: string;
  company?: string;
  twitter?: string;
  mastodon?: string;
  linkedin?: string;
  github?: string;
  image?: string;
  bio?: string;
  hidden?: boolean | string;
}

interface SpeakerTalk {
  authors: SpeakerAuthor[];
}

interface SpeakerGroup {
  talks: SpeakerTalk[];
}

const KEYNOTE_SPEAKER_IDS = ['caseyellis', 'phillipwylie'];

function getParsedSpeakerConfig(): SpeakerGroup[] {
  const raw: unknown = config;
  if (Array.isArray(raw)) return raw as SpeakerGroup[];
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as SpeakerGroup[];
    } catch (_) { /* noop */ }
  }
  return [];
}

export default class Speakers extends Component {
  static displayName = 'Speakers';

  getRandomKernel(lengthOfArray: number, indexToExclude: number, secondLastKernelIndex: number) {
    // This function just grabs a random index that wasn't one of the last two.
    // Obviously, due to math, you need to send in at least an array of length 3.
    let rand: number | null = null;

    while (rand === null || rand === indexToExclude || rand === secondLastKernelIndex) {
      rand = Math.round(Math.random() * (lengthOfArray - 1));
    }
    return rand;
  }

  getSpeakers() {
    const parsed = getParsedSpeakerConfig();
    const talks = parsed.map(a => a.talks).flat();
    const speakers = talks.map(a => a.authors).flat()
      .filter((ele) => ele.name !== '')
      .filter((ele) => !ele.hidden)
      .filter((ele) => !KEYNOTE_SPEAKER_IDS.includes((ele.speaker_id || '').toLowerCase()));


    // Order Alphabetically
    const speakers_ordered = speakers.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    
    // Because of the way I stack two per row, get a new kernel that's not it's neighbor either up or down.
    let lastKernelIndex = 99;
    let secondLastKernelIndex = 100;
    const speakerGroup = speakers_ordered.filter((el) => {
      if (el.hidden === "true") {
        return false;
      }
      return true;
    }).map((ele, idx) => {
      const randKernel = this.getRandomKernel(17, lastKernelIndex, secondLastKernelIndex);
      secondLastKernelIndex = lastKernelIndex;
      lastKernelIndex = randKernel;

      // If image DNE, assign the random kernel we've generated.
      const img = ele.image ? `speakers/${ele.image}` : `kernels/${randKernel}.png`;

      return (
        <Individuals key={idx}
          speakerId={ele.speaker_id}
          talkId={ele.talk_id}
          speaker={ele.name} 
          company={ele.company}
          twitter={ele.twitter}
          mastodon={ele.mastodon}
          linkedin={ele.linkedin}
          github={ele.github}
          image={img}
          bio={ele.bio}
        />
      )
    });
    // }, {talksOuter: talks});

    return speakerGroup;
  }

  render() {
    const speakers = this.getSpeakers();
    return (
      <div className='venue-section speaker-section'>
        <div className='speakers'>
          {speakers}
        </div>
      </div>
    );
  }
}
