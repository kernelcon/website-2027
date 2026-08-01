import { Component } from 'react';
import './Talks.scss';

// import { agendaConfig as config } from '../../../content';
import { speakerConfig as config } from '../../../content';

interface TalkAuthor {
  name: string;
}

interface Talk {
  title: string;
  authors: TalkAuthor[];
  abstract?: string;
}

interface TalkGroup {
  talks: Talk[];
}

export default class Talks extends Component {
  static displayName = 'Talks';

  getTalks() {
    const talks = (config as TalkGroup[]).map(a => a.talks).flat();
    const talks_ordered = talks.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));

    const talksComp = talks_ordered.map((ele, idx) => {
      const speakers = ele.authors.map((el, dx) => {
        return (
          <span className='author' key={dx}>{el.name}</span>
        )
      });
      return (
        <div className='talk-section' key={idx}>
          <h3 className='talk-title'>{ele.title}</h3>
          <div className='author-section'>{speakers}</div>
          <div className='abstract'>{ele.abstract}</div>
        </div>
      )
    });

    return talksComp;
  }

  render() {
    const talks = this.getTalks();
    return (
      <div className='venue-section talks-section'>
        <div className='talks'>
          {talks}
        </div>
      </div>
    );
  }
}
