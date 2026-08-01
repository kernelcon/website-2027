import { Component } from 'react';
import { img as resolveImg } from '../../../static/images';
import TwitterLogoLight from "../../../static/images/icons/x-logo-black.png"
import TwitterLogoDark from "../../../static/images/icons/x-logo-white.png"
import MastodonLogoLight from "../../../static/images/icons/mastodon-logo-black.svg"
import MastodonLogoDark from "../../../static/images/icons/mastodon-logo-white.svg"
import LinkedinLogo from "../../../static/images/icons/linkedin.png"
import GithubLogoLight from "../../../static/images/icons/github-light-mode.png"
import GithubLogoDark from "../../../static/images/icons/github-dark-mode.png"

interface IndividualsProps {
  speakerId?: string;
  talkId?: string;
  speaker?: string;
  company?: string;
  twitter?: string;
  mastodon?: string;
  linkedin?: string;
  github?: string;
  image?: string;
  bio?: string;
}

class Individuals extends Component<IndividualsProps> {
  static displayName = 'Individuals';

  static defaultProps: IndividualsProps = {
    speakerId: '',
    talkId: '',
    speaker: '',
    company: '',
    twitter: '',
    mastodon: '',
    linkedin: '',
    github: '',
    image: '',
    bio: ''
  };

  // require(`../../../static/images/speakers/${img}`)
  getImage(image?: string) {
    return resolveImg(image);
  }

  changeTab(_id?: string) {
    window.location.reload();
  }

  render() {
    const imgSrc = this.getImage(this.props.image);
    const twitter = this.props.twitter ? ((this.props.twitter.includes("x.com") || this.props.twitter.includes("twitter.com")) ? this.props.twitter : "https://x.com/" + this.props.twitter) : '';
    const github = this.props.github ? ((this.props.github.includes("github.com")) ? this.props.github : "https://github.com/" + this.props.github) : '';
    

    return (
      <div id={this.props.speakerId}
        className='individual-speaker-section'>
        <div className='speaker-wording'>
          <span>
            <h3 className='speaker-name'>
                {this.props.speaker}
            </h3>
            {(this.props.company || twitter || this.props.mastodon || github || this.props.linkedin) && <span className='speaker-titles'>
              {this.props.company && <span>{this.props.company}</span>}
              {twitter && 
                <span>
                  <a href={twitter} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow">
                    <img src={TwitterLogoLight} 
                      className="light-mode-logo speaker-socials-logo"  
                      alt="twitter-logo"/>
                  </a>
                  <a href={twitter} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow">
                    <img src={TwitterLogoDark} 
                    className="dark-mode-logo speaker-socials-logo"  
                    alt="twitter-logo"/>
                  </a>
                </span>
              }
              {this.props.mastodon && <span><a href={this.props.mastodon} target="_blank" rel="noopener noreferrer nofollow"><img src={MastodonLogoLight} className="light-mode-logo speaker-socials-logo"  alt="mastodon-logo"/></a><a href={this.props.mastodon} target="_blank" rel="noopener noreferrer nofollow"><img src={MastodonLogoDark} className="dark-mode-logo speaker-socials-logo"  alt="mastodon-logo"/></a></span>}
              {github && 
                <span>
                  <a href={github} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow">
                    <img src={GithubLogoLight} 
                    className="light-mode-logo speaker-socials-logo"  
                    alt="github-logo"/>
                  </a>
                  <a href={github} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow">
                    <img src={GithubLogoDark} 
                      className="dark-mode-logo speaker-socials-logo"  
                      alt="github-logo"/>
                  </a>
                </span>
              }
              {this.props.linkedin && <span><a href={this.props.linkedin} target="_blank" rel="noopener noreferrer nofollow"><img src={LinkedinLogo} className="speaker-socials-logo"  alt="linkedin-logo"/></a></span>}
            </span>}
            {/* {(this.props.mastodon ) && <span className='speaker-titles'>
              {this.props.mastodon && <span>{this.props.mastodon}</span>}
            </span>} */}
            {/* {(this.props.mastodon ) && <span className='speaker-titles'>
              {this.props.mastodon && <img src={MastodonLogo} className="light-mode-logo"  alt="mastodon-logo"/>}
            </span>} */}
            {/* {(this.props.github ) && <span className='speaker-titles'>
              {this.props.github && <span><a href={this.props.github} target="_blank" rel="noopener noreferrer nofollow">GitHub</a></span>}
            </span>}
            {(this.props.linkedin ) && <span className='speaker-titles'>
              {this.props.linkedin && <span><a href={this.props.linkedin} target="_blank" rel="noopener noreferrer nofollow">LinkedIn</a></span>}
            </span>} */}
            <img src={imgSrc}
              alt={this.props.speaker}
              className='bio-image'
            />
            <p>{this.props.bio}</p>
          </span>
        </div>
      </div>
    );
  }
}

export default Individuals;
