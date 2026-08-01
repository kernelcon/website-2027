import { Component } from 'react';
import { imgIn } from '../../static/images';
import './CallOuts.scss';

interface CallOutDetail {
  detail_name?: string;
  detail_desc?: string;
}

interface CallOutSocials {
  instagram?: string;
  twitter?: string;
  music?: string;
  website?: string;
  patreon?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
}

interface CallOutMusic {
  iframe?: string;
  href?: string;
  desc?: string;
  img?: string;
}

interface CallOutLogo {
  image_name?: string;
  image_class?: string;
  dark_mode_support?: boolean;
  dark_mode_image_name?: string;
  dark_mode_image_class?: string;
}

interface CallOutItem {
  id?: string | number;
  order?: number;
  title: string;
  author?: string;
  logo: CallOutLogo;
  details?: CallOutDetail[];
  socials?: CallOutSocials;
  music?: CallOutMusic;
  description?: string;
  final_details?: string;
}

interface CallOutsProps {
  title: string;
  config: CallOutItem[];
}

class CallOuts extends Component<CallOutsProps> {
  static displayName = 'CallOuts';

  getImage(imageName?: string): string | null {
    if (!imageName || imageName === '') {
      return null;
    }
    return imgIn('logos', imageName);
  }

  createMarkup(html?: string): { __html: string } {
    if (!html) return {__html: ''};

    // Regex to match URLs (http://, https://, and www.)
    // This will match URLs that are not already inside HTML tags
    const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;

    // Split HTML into parts: text nodes and HTML tags
    // We'll only auto-link URLs in text nodes, not inside existing anchor tags
    let processedHtml = html;

    // Find all matches and process them in reverse order to maintain indices
    const matches: { index: number; url: string; length: number }[] = [];
    let match: RegExpExecArray | null;

    while ((match = urlRegex.exec(html)) !== null) {
      // Check if this match is inside an existing anchor tag
      const beforeText = html.substring(0, match.index);

      // Count unclosed <a> tags before this position
      const openTags = (beforeText.match(/<a\b[^>]*>/gi) || []).length;
      const closeTags = (beforeText.match(/<\/a>/gi) || []).length;
      const isInsideAnchor = openTags > closeTags;

      // Also check if we're inside an href attribute
      const lastHrefIndex = beforeText.lastIndexOf('href=');
      let isInHref = false;
      if (lastHrefIndex !== -1) {
        // Find the opening quote after href=
        const hrefValueStart = beforeText.indexOf('"', lastHrefIndex);
        const hrefValueStartSingle = beforeText.indexOf("'", lastHrefIndex);
        let quoteStart = -1;
        let quoteChar = '';

        if (hrefValueStart !== -1 && (hrefValueStartSingle === -1 || hrefValueStart < hrefValueStartSingle)) {
          quoteStart = hrefValueStart;
          quoteChar = '"';
        } else if (hrefValueStartSingle !== -1) {
          quoteStart = hrefValueStartSingle;
          quoteChar = "'";
        }

        // If we found an opening quote, check if we're still inside it
        if (quoteStart !== -1) {
          const closingQuote = beforeText.indexOf(quoteChar, quoteStart + 1);
          isInHref = closingQuote === -1; // Still inside if no closing quote found
        }
      }

      if (!isInsideAnchor && !isInHref) {
        matches.push({
          index: match.index,
          url: match[0],
          length: match[0].length
        });
      }
    }

    // Replace URLs with anchor tags (process in reverse to maintain indices)
    for (let i = matches.length - 1; i >= 0; i--) {
      const m = matches[i];
      let url = m.url;

      // Add https:// if it starts with www.
      if (url.toLowerCase().startsWith('www.')) {
        url = 'https://' + url;
      }

      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${m.url}</a>`;
      processedHtml = processedHtml.substring(0, m.index) +
                     linkHtml +
                     processedHtml.substring(m.index + m.length);
    }

    return {__html: processedHtml};
  }


  render() {
    // const callOutsOrdered = this.props.config.sort((a,b) => a.title.localeCompare(b.title));
    const callOutsOrdered = this.props.config.sort((a, b) => (a.order || b.order) ? ((a.order ?? 0) - (b.order ?? 0)) : a.title.localeCompare(b.title));
    const callOuts = callOutsOrdered.map((ele) => {
      const image = this.getImage(ele.logo.image_name);
      let darkModeImage: string | null = null;
      if ( ele.logo.dark_mode_support ) {
        darkModeImage = this.getImage(ele.logo.dark_mode_image_name);
      }
      const detailBox = ele.details && ele.details.map((el, idx) => {
        return (
          <div className='callout-details' key={idx}>
            <div className='callout-detail-name'>{el.detail_name}</div>
            <div className='callout-detail-desc'>{el.detail_desc}</div>
          </div>
        );
      });

      const hasSocials = !!(
        ele.socials &&
        (
          ele.socials.instagram ||
          ele.socials.twitter ||
          ele.socials.music ||
          ele.socials.website ||
          ele.socials.patreon ||
          ele.socials.tiktok ||
          ele.socials.youtube ||
          ele.socials.facebook
        )
      );

      return (
        <div className='callout-area'
          key={ele.id}>
          <div className='callout-title'>{ele.title}</div>
          <div className='callout-section'>
            <div className='callout-name-logo'>
              {ele.author && (
                <div className='callout-author'>
                  From {ele.author.startsWith('http://') || ele.author.startsWith('https://') ? (
                    <a href={ele.author} target="_blank" rel="noopener noreferrer">{ele.author}</a>
                  ) : (
                    ele.author
                  )}
                </div>
              )}
              <div className='callout-logo'>
                {image && <img className={`callout-img ${ele.logo.image_class}`} src={image} alt={ele.title} />}
                {darkModeImage && <img className={`callout-img ${ele.logo.dark_mode_image_class}`} src={darkModeImage} alt={ele.title} />}
              </div>
            </div>
            <div className='callout-description'>
              {hasSocials && ele.socials &&
                <span className='speaker-titles'>
                  {ele.socials.instagram && <span><a href={`https://www.instagram.com/${ele.socials.instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a></span>}
                  {ele.socials.twitter && <span><a href={`https://www.x.com/${ele.socials.twitter}`} target="_blank" rel="noopener noreferrer">Twitter</a></span>}
                  {ele.socials.music && <span><a href={ele.socials.music} target="_blank" rel="noopener noreferrer">Music</a></span>}
                  {ele.socials.website && <span><a href={ele.socials.website} target="_blank" rel="noopener noreferrer">Website</a></span>}
                  {ele.socials.patreon && <span><a href={ele.socials.patreon} target="_blank" rel="noopener noreferrer">Patreon</a></span>}
                  {ele.socials.tiktok && <span><a href={ele.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></span>}
                  {ele.socials.youtube && <span><a href={ele.socials.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></span>}
                  {ele.socials.facebook && <span><a href={ele.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></span>}
                </span>
              }
              {ele.music && ele.music.iframe && ele.music.href &&
                <iframe
                  className='band-camp'
                  title={ele.music.desc}
                  src={ele.music.iframe}
                  seamless
                >
                  <a
                    href={ele.music.href}
                    style={ele.music.img ? { backgroundImage: ele.music.img } : {}}
                  >
                    {ele.music.desc}
                  </a>
                </iframe>
              }
              <span dangerouslySetInnerHTML={this.createMarkup(ele.description)}></span>
              {detailBox}
              {ele.final_details && <span className='final_details' dangerouslySetInnerHTML={this.createMarkup(ele.final_details)}></span>}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className=''>
        <h3 className='title'>{this.props.title}</h3>
        {callOuts}
      </div>
    );
  }
}

export default CallOuts;
