import { Component } from 'react';

import { ocConfig } from '../../content';
import { imgIn } from '../../static/images';
import './About.scss';

interface OcPerson {
  id?: number;
  name: string;
  title?: string;
  image?: string;
  twitter?: string;
  mastodon?: string;
  mastodon_url?: string;
  oc?: boolean;
}

interface OcGroup {
  idx?: number;
  heading?: string;
  subHeading?: string;
  people: OcPerson[];
}

class Organizers extends Component {
  static displayName = 'Organizers';

  getImage(ele: OcPerson): string {
    const imageName = ele.image ? ele.image : 'kernel.png';
    return imgIn('oc', imageName);
  }

  render() {

    const oc = (ocConfig as OcGroup[]).map((ele) => {
      const people = ele.people.sort((a, b) => {
        return a.name.localeCompare(b.name)
      });

      const display = people.map((el) => {
        const imgUrl = this.getImage(el);
        return (
          <div className='oc-member'
            key={el.name}>
            <div className='oc-member-box'>
              <div className='oc-member-img'>
                <img src={imgUrl} height="70" alt={el.name}/>
              </div>
              <div className='oc-text-section'>
                <div className='oc-name'>{el.name}</div>
                <div className='oc-title'>{el.title}</div>
                {el.twitter && <a className='oc-twitter' target='_blank' rel='noopener noreferrer' href={`https://twitter.com/${el.twitter}`}>{`@${el.twitter}`}</a>}
                {el.mastodon && <a className='oc-twitter' target='_blank' rel='noopener noreferrer' href={`${el.mastodon_url}`}>{`@${el.mastodon}`}</a>}
              </div>
            </div>
          </div>
        );
      });

      return (
        <div key={ele.idx}>
          <div className='tab-title'>
            {ele.heading}
          </div>
          {ele.subHeading && <div className='tab-subtitle'>
            {ele.subHeading}
            <br />
            <br />
          </div>}
          <div className='oc-list'>
            {display}
          </div>
        </div>
      );
    });


    return (
      <div className='organizers'>
        {oc}
      </div>
    );
  }
}

export default Organizers;
