import { Component } from 'react';
import './Dates.scss';

import { dateConfig as config } from '../../content';

interface DateItem {
  title: string;
  description?: string;
  date: string;
  hidden?: string;
}

class Dates extends Component {
  static displayName = 'Dates';

  render() {
    const isDatePassed = (dateString: string) => {
      if (!dateString) return false;
      const dateMatch = dateString.match(/([A-Z]{3})\s+(\d+)/);
      if (!dateMatch) return false;
      const yearMatch = dateString.match(/(\d{4})/);
      if (!yearMatch) return false;
      const monthMap: Record<string, number> = {
        'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
        'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12,
      };
      const month = monthMap[dateMatch[1].toUpperCase()];
      if (!month) return false;
      const dateObj = new Date(parseInt(yearMatch[1]), month - 1, parseInt(dateMatch[2]));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dateObj <= today;
    };

    const isConferenceDay = (title: string) =>
      title.toLowerCase().includes('kernelcon') || title.toLowerCase().includes('conference days');

    const dates = (config as DateItem[]).map((ele, idx) => {
      const isPassed = isDatePassed(ele.date);
      const isHighlight = isConferenceDay(ele.title);
      const classes = [
        'date-box',
        isPassed ? 'past-date' : '',
        isHighlight ? 'highlight-date' : '',
      ].filter(Boolean).join(' ');

      return (
        <div className={classes} key={`date-${idx}`}>
          <div className='dl-title'>{ele.title}</div>
          {ele.description && <div className='dl-description'>{ele.description}</div>}
          <div className='dl-date'>{ele.date}</div>
          {isPassed && <span className='past-badge'>Past</span>}
        </div>
      );
    });

    return (
      <div className='dates-page'>
        <div className='container'>
          <div className='dates-header'>
            <span className='dates-pre-label'>Tour Dates</span>
            <h1>Important <span>Dates</span></h1>
            <div className='dates-sub'>MAR 4–5, 2027 · Omaha, NE · All times Central</div>
            <div className='dates-rule' />
          </div>
          <div className='dates-list'>
            {dates}
          </div>
        </div>
      </div>
    );
  }
}

export default Dates;
