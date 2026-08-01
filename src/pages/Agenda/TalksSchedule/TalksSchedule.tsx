import { Component, Fragment } from 'react';
import Modal from '../../../components/Modal/Modal';
import Donut from '../../../components/Charts/Donut';
import './TalksSchedule.scss';

import TwitterLogoLight from '../../../static/images/icons/x-logo-black.png';
import TwitterLogoDark from '../../../static/images/icons/x-logo-white.png';
import MastodonLogoLight from '../../../static/images/icons/mastodon-logo-black.svg';
import MastodonLogoDark from '../../../static/images/icons/mastodon-logo-white.svg';
import LinkedinLogo from '../../../static/images/icons/linkedin.png';
import GithubLogoLight from '../../../static/images/icons/github-light-mode.png';
import GithubLogoDark from '../../../static/images/icons/github-dark-mode.png';
import CarnageLogoSvg from '../../../static/images/logos/CARNAGE2.svg';
import PanicLogoSvg from '../../../static/images/logos/panic.svg';
import PanicPosterImg from '../../../static/images/logos/panic.png';

import { imgIn } from '../../../static/images';

import { agendaConfig as config, speakerConfig } from '../../../content';

interface AgendaAuthor {
  name?: string;
  speakerId?: string;
  company?: string;
  twitter?: string;
  mastodon?: string;
  bluesky?: string;
  github?: string;
  linkedIn?: string;
  linkedin?: string;
  image?: string;
  bio?: string;
  hidden?: boolean;
}

interface AgendaTalk {
  time: string;
  minutes: number;
  roomIndex: number[];
  talkTitle: string;
  talkDescription?: string;
  talkTechLevel?: string | number;
  talkId?: string;
  emptySlot?: boolean;
  setupSlot?: boolean;
  authors: AgendaAuthor[];
}

interface RoomInfo {
  roomName: string;
}

interface AgendaDay {
  dayOfWeek: string;
  date: string;
  roomsInfo: RoomInfo[];
  talks: AgendaTalk[];
}

interface SpeakerConfigAuthor {
  name?: string;
  bio?: string;
  image?: string;
  company?: string;
  twitter?: string;
  mastodon?: string;
  bluesky?: string;
  github?: string;
  linkedin?: string;
  speaker_id?: string;
}

interface SpeakerConfigTalk {
  authors?: SpeakerConfigAuthor[];
}

interface SpeakerConfigGroup {
  talks?: SpeakerConfigTalk[];
}

interface SpeakerDetails {
  name: string;
  bio: string | null;
  image: string | null;
  company: string | null;
  twitter: string | null;
  mastodon: string | null;
  bluesky: string | null;
  github: string | null;
  linkedin: string | null;
}

const agenda = config as unknown as AgendaDay[];

// Normalize name for lookup: "Matt Scheurer" -> "mattscheurer", "Aaron Grothe (KCOWIH)" -> "aarongrothekcowih"
function normalizeName(name?: string) {
  return (name || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

// Webpack injects speakerConfig as a JSON string; parse so we can iterate
function getParsedSpeakerConfig(): SpeakerConfigGroup[] {
  const raw: unknown = speakerConfig;
  if (Array.isArray(raw)) return raw as SpeakerConfigGroup[];
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as SpeakerConfigGroup[];
    } catch (_) { /* noop */ }
  }
  return [];
}

// Build lookup by speaker_id and by normalized name; store full details for modal (bio, image, company, socials)
const speakerBioLookup: Record<string, SpeakerDetails> = (() => {
  const map: Record<string, SpeakerDetails> = {};
  try {
    const config = getParsedSpeakerConfig();
    config.forEach((group) => {
      (group.talks || []).forEach((talk) => {
        (talk.authors || []).forEach((a) => {
          const name = (a.name || '').trim();
          const bio = (a.bio || '').trim();
          if (!name && !bio) return;
          const entry: SpeakerDetails = {
            name,
            bio,
            image: (a.image || '').trim() || null,
            company: (a.company || '').trim() || null,
            twitter: (a.twitter || '').trim() || null,
            mastodon: (a.mastodon || '').trim() || null,
            bluesky: (a.bluesky || '').trim() || null,
            github: (a.github || '').trim() || null,
            linkedin: (a.linkedin || '').trim() || null
          };
          const id = (a.speaker_id || '').toLowerCase().replace(/\s+/g, '');
          if (id && !map[id]) map[id] = entry;
          const nameKey = normalizeName(name);
          if (nameKey && !map[nameKey]) map[nameKey] = entry;
        });
      });
    });
  } catch (_) { /* noop */ }
  return map;
})();

function getSpeakerDetails(author?: AgendaAuthor | null): SpeakerDetails | null {
  if (!author) return null;
  const id = (author.speakerId || '').toLowerCase().replace(/\s+/g, '');
  const nameKey = normalizeName(author.name);
  const entry = (id && speakerBioLookup[id]) || (nameKey && speakerBioLookup[nameKey]);
  if (!entry) return { name: (author.name || '').trim(), bio: (author.bio || '').trim() || null, image: null, company: null, twitter: null, mastodon: null, bluesky: null, github: null, linkedin: null };
  return {
    name: entry.name || (author.name || '').trim(),
    bio: (entry.bio || (author.bio || '').trim()) || null,
    image: entry.image || null,
    company: entry.company || null,
    twitter: entry.twitter || null,
    mastodon: entry.mastodon || null,
    bluesky: entry.bluesky || null,
    github: entry.github || null,
    linkedin: entry.linkedin || null
  };
}

const NON_CLICKABLE_TITLES = [
  'Lunch (on your own)',
  'Registration Opens',
  "Open Bar / Appetizers & Hors d'oeuvres",
  'Kernel Panic',
  'Opening Remarks',
  'Day 2 Opening Remarks'
];

function isSpeakerClickable(author: AgendaAuthor | undefined, talkTitle: string) {
  if (!(author && author.name)) return false;
  if (author.name === 'Kernelcon Crew') return false;
  if (NON_CLICKABLE_TITLES.includes(talkTitle)) return false;
  return true;
}

const CARNAGE_TALK_TITLE = 'Kernelcon Carnage II Setup';
const KERNEL_PANIC_TITLE = 'Kernel Panic';

function renderTalkTitle(title: string) {
  if (title === CARNAGE_TALK_TITLE) {
    return (
      <>
        <img src={CarnageLogoSvg} alt="Carnage" className="talk-title-logo-icon talk-title-carnage-icon" /> Setup
      </>
    );
  }
  if (title === KERNEL_PANIC_TITLE) {
    return (
      <img src={PanicLogoSvg} alt="Kernel Panic" className="talk-title-logo-icon talk-title-panic-icon" />
    );
  }
  return title;
}

interface ModalData {
  title: string;
  description: string;
  techLevel: string | number;
  authors: AgendaAuthor[];
  time: string;
}

interface TalksScheduleState {
  isOpen: boolean;
  dayIndex: number;
  showTabNum: number;
  modal: ModalData;
  modalView: 'talk' | 'speaker';
  selectedSpeaker: SpeakerDetails | null;
}

export default class TalksSchedule extends Component<object, TalksScheduleState> {
  static displayName = 'TalksSchedule';

  constructor(props: object) {
    super(props);
    this.state = {
      isOpen: false,
      dayIndex: 0,
      showTabNum: 0,
      modal: {
        title: '',
        description: '',
        techLevel: '',
        authors: [],
        time: ''
      },
      modalView: 'talk', // 'talk' | 'speaker'
      selectedSpeaker: null // { name, bio } when viewing a speaker
    };
  }

  showSpeakerInModal = (author: AgendaAuthor) => {
    const details = getSpeakerDetails(author || {});
    this.setState({
      modalView: 'speaker',
      selectedSpeaker: details
    });
  };

  backToTalk = () => {
    this.setState({
      modalView: 'talk',
      selectedSpeaker: null
    });
  };

  toggleScheduleDate = (index: number) => {
    this.setState({
      dayIndex: index,
      showTabNum: index
    });
  };

  popModal = (title: string, description: string, techLevel: string | number, authors: AgendaAuthor[], time: string) => () => {
    this.setState({
      modal: {
        title,
        description,
        techLevel,
        authors: authors || [],
        time
      },
      modalView: 'talk',
      selectedSpeaker: null
    }, () => {
      this.toggleModal();
    });
  };

  toggleModal = () => {
    this.setState((prev): Pick<TalksScheduleState, 'isOpen' | 'modalView' | 'selectedSpeaker'> =>
      prev.isOpen
        ? { isOpen: false, modalView: 'talk', selectedSpeaker: null }
        : { isOpen: true, modalView: prev.modalView, selectedSpeaker: prev.selectedSpeaker },
    );
  };

  render() {
    const currentDay = agenda[this.state.dayIndex];
    const dayOfWeek = currentDay.dayOfWeek;

    const formatTime = (timeStr: string) => {
      if (!timeStr || timeStr.length < 4) return timeStr;
      const h = parseInt(timeStr.slice(0, 2), 10);
      const m = timeStr.slice(2);
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${hour}:${m} ${ampm}`;
    };

    const scheduleTabs = agenda.map((ele, index) => {
      return (
        <li key={index}>
          <input type='radio'
            onChange={() => {this.toggleScheduleDate(index)}}
            name='schedule-tabs'
            id={`tab${index}`}
            checked={index === this.state.showTabNum ? true : false} />
            <label htmlFor={`tab${index}`}>{ele.dayOfWeek}<span>{ele.date}</span></label>
        </li>
      );
    });

    const tabsHeader = (
      <>
        <ul className='tabs'>
          {scheduleTabs}
        </ul>
        <div className='schedule-heading'>{`Tentative ${dayOfWeek} Speaking Schedule`}</div>
        <div className='tz-note'>Note: All times listed are in Central Time.</div>
      </>
    );


    const trackHeaders = currentDay.roomsInfo.map((ele, index) => {
      let label = ele.roomName;
      if (ele.roomName === 'Mountain') {
        label = '🏔️ Mountain';
      } else if (ele.roomName === 'Beach') {
        label = '🏖️ Beach';
      } else if (ele.roomName === 'Forest') {
        label = '🌲 Forest';
      }
      return (
        <div
          key={index}
          className='track'
          style={{ gridColumn: index + 1, gridRow: 1 }}
        >
          <span className='track-label'>{label}</span>
        </div>
      );
    });

    let rows = 2;
    const totalCols = currentDay.roomsInfo.length;
    const talksGrid = currentDay.talks.map((ele, index) => {
      const gridColumnStart = ele.roomIndex[0] + 1;
      const gridColumnEnd = ele.roomIndex[ele.roomIndex.length - 1] + 2;
      const gridColumn = `${gridColumnStart} / ${gridColumnEnd}`;

      const rowSpan = ele.minutes >= 42
        ? (ele.minutes > 90 ? 2 * Math.floor(ele.minutes / 30) : 2)
        : 1;
      const gridRow = rowSpan > 1 ? `${rows} / ${rows + rowSpan}` : `${rows}`;

      const isLastSlotForThisTime = index + 1 >= currentDay.talks.length || currentDay.talks[index + 1].time !== ele.time;
      const rowComplete = gridColumnEnd - 1 >= totalCols || isLastSlotForThisTime;
      if (rowComplete) {
        rows += ele.minutes >= 42 ? 2 : 1;
      }
      
      const authorsString = ele.authors
        .filter((a) => a.name)
        .map((a) => a.name)
        .join(' & ');
      const hasAuthors = authorsString.length > 0;

      if (ele.emptySlot) {
        return (
          <div
            className="schedule-slot-empty"
            style={{gridColumn: gridColumn, gridRow: gridRow}}
            key={index}
            aria-hidden="true"
          />
        );
      }

      if (ele.setupSlot) {
        return (
          <div
            className="schedule-slot-setup"
            style={{ gridArea: '15 / 3 / 23 / 4' }}
            key={index}
            aria-hidden="false"
            title="Room setup — not a session">
            <div className="box">
              <span className="talk-time">{formatTime(ele.time)}</span>
              <div className="talk-title-and-description">
                <span className="talk-title">{renderTalkTitle(ele.talkTitle)}</span>
              </div>
            </div>
          </div>
        );
      }

      const showDescription = ['Registration Opens', 'Lunch (on your own)', "Open Bar / Appetizers & Hors d'oeuvres", 'Kernel Panic'].includes(ele.talkTitle) && ele.talkDescription;
      const fullTitleAndAuthors = hasAuthors ? `${ele.talkTitle} · ${authorsString}` : ele.talkTitle;

      return (
        <button
          type="button"
          className={`schedule-talk-trigger${ele.talkTitle === KERNEL_PANIC_TITLE ? ' schedule-talk-panic' : ''}`}
          style={{gridColumn: gridColumn, gridRow: gridRow}}
          key={index}
          title={fullTitleAndAuthors}
          onClick={this.popModal(ele.talkTitle, ele.talkDescription ?? '', ele.talkTechLevel ?? '', ele.authors, ele.time)}>
          <div className='box'>
            <span className='talk-time'>{formatTime(ele.time)}</span>
            <div className="talk-title-and-description">
              <div
                className={`${ele.minutes >= 42 ? "truncate-overflow-4 truncate-overflow" : "truncate-overflow-1 truncate-overflow"}`}>
                <span className="talk-title">{renderTalkTitle(ele.talkTitle)}</span>
                {hasAuthors && <><span className="talk-separator"> · </span><span className="talk-authors">{authorsString}</span></>}
              </div>
              {showDescription && <span className="talk-description">{ele.talkDescription}</span>}
            </div>
          </div>
        </button>
      );
    });

    let gridTemplateRows = `42px `.repeat(rows - 1);

    const gridTemplateColumnsPercentage = (100 / totalCols).toFixed(1);
    const gridTemplateColumnsString = `calc(${gridTemplateColumnsPercentage}% - 10px) `;
    const gridTemplateColumns = `${gridTemplateColumnsString.repeat(totalCols)}`;
    
    const authorsWithName = (this.state.modal.authors || []).filter((a) => a.name);
    const percentTech = this.state.modal.techLevel ? (Number(this.state.modal.techLevel) / 5) * 100 : '';
    const isSpeakerView = this.state.modalView === 'speaker' && this.state.selectedSpeaker;

    const modalTitle = renderTalkTitle(this.state.modal.title);
    const speaker = this.state.selectedSpeaker;
    const modalContent = isSpeakerView && speaker ? (
      <div className="modal-content speaker-bio-modal">
        <div className="speaker-bio-meta">
          {speaker.image && (
            <div className="speaker-bio-image-wrap">
              <img
                src={imgIn('speakers', speaker.image)}
                alt={speaker.name}
                className="speaker-bio-image"
              />
            </div>
          )}
          <div className="speaker-bio-meta-text">
            <div className="speaker-bio-name">{speaker.name}</div>
            {speaker.company && <div className="speaker-bio-company">{speaker.company}</div>}
            {(speaker.twitter || speaker.mastodon || speaker.github || speaker.linkedin) && (
              <div className="speaker-bio-socials">
                {speaker.twitter && (
                  <a href={speaker.twitter.includes('x.com') || speaker.twitter.includes('twitter.com') ? speaker.twitter : 'https://x.com/' + speaker.twitter} target="_blank" rel="noopener noreferrer nofollow" aria-label="X">
                    <img src={TwitterLogoLight} className="light-mode-logo speaker-bio-social-icon" alt="" />
                    <img src={TwitterLogoDark} className="dark-mode-logo speaker-bio-social-icon" alt="" />
                  </a>
                )}
                {speaker.mastodon && (
                  <a href={speaker.mastodon} target="_blank" rel="noopener noreferrer nofollow" aria-label="Mastodon">
                    <img src={MastodonLogoLight} className="light-mode-logo speaker-bio-social-icon" alt="" />
                    <img src={MastodonLogoDark} className="dark-mode-logo speaker-bio-social-icon" alt="" />
                  </a>
                )}
                {speaker.github && (
                  <a href={speaker.github.includes('github.com') ? speaker.github : 'https://github.com/' + speaker.github} target="_blank" rel="noopener noreferrer nofollow" aria-label="GitHub">
                    <img src={GithubLogoLight} className="light-mode-logo speaker-bio-social-icon" alt="" />
                    <img src={GithubLogoDark} className="dark-mode-logo speaker-bio-social-icon" alt="" />
                  </a>
                )}
                {speaker.linkedin && (
                  <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer nofollow" aria-label="LinkedIn">
                    <img src={LinkedinLogo} className="speaker-bio-social-icon" alt="" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="speaker-bio-text">
          {speaker.bio || 'No bio available.'}
        </p>
        <button type="button" className="modal-back-to-talk" onClick={this.backToTalk}>
          ← Back to talk
        </button>
      </div>
    ) : (
      <div className='modal-content'>
        {authorsWithName.length > 0 && (
          <div className='modal-speakers'>
            {`${authorsWithName.length > 1 ? 'Speakers' : 'Speaker'}: `}
            <span className='modal-authors'>
              {authorsWithName.map((author, idx) => {
                const clickable = isSpeakerClickable(author, this.state.modal.title);
                return (
                  <Fragment key={idx}>
                    {idx > 0 && ' & '}
                    {clickable ? (
                      <button
                        type="button"
                        className="modal-author-link"
                        onClick={() => this.showSpeakerInModal(author)}
                        title={`View ${author.name} bio`}
                      >
                        {author.name}
                      </button>
                    ) : (
                      <span>{author.name}</span>
                    )}
                  </Fragment>
                );
              })}
            </span>
          </div>
        )}
        <div className='modal-headline'>
          <div className='modal-headline-time'>Start: <span className='modal-time'>{formatTime(this.state.modal.time)}</span></div>
          {percentTech && (
            <div className='modal-headine-percentage'>
              <Donut value={percentTech} />
              <span className='tech-label'>% technical</span>
            </div>
          )}
        </div>
        <div className='modal-description'>
          <div className='modal-description-heading'>Description:</div>
          {this.state.modal.description}
        </div>
        {this.state.modal.title === KERNEL_PANIC_TITLE && (
          <div className="modal-panic-poster">
            <img src={PanicPosterImg} alt="Kernel Panic" className="modal-panic-poster-img" />
          </div>
        )}
      </div>
    );

    return (
      <div className='schedule-talks'>

        <Modal
          show={this.state.isOpen}
          onClose={this.toggleModal}
          title={modalTitle as unknown as string}
        >
          {modalContent}
        </Modal>

        {tabsHeader}
        <div className={`grid-wrapper`}
          style={{gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows}}>
          {trackHeaders}
          {talksGrid}

        </div>
      </div>
    )
  }
}
