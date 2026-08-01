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
    // Helper function to check if a date has passed
    const isDatePassed = (dateString: string) => {
      if (!dateString || dateString.toLowerCase().includes('early') || dateString.toLowerCase().includes('about')) {
        return false;
      }
      
      // Parse the date - handles both single dates and ranges
      const dateMatch = dateString.match(/([A-Z]{3})\s+(\d+)/);
      if (!dateMatch) return false;
      
      const month = dateMatch[1];
      const day = parseInt(dateMatch[2]);
      const yearMatch = dateString.match(/(\d{4})/);
      if (!yearMatch) return false;
      const year = parseInt(yearMatch[1]);
      
      const monthMap: Record<string, number> = {
        'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
        'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
      };
      
      if (!monthMap[month.toUpperCase()]) return false;
      
      const dateObj = new Date(year, monthMap[month.toUpperCase()] - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return dateObj <= today;
    };

    const dates = (config as DateItem[]).map((ele, idx) => {
      const isPassed = isDatePassed(ele.date);
      
      return (
        <div className={`date-box ${isPassed ? 'past-date' : ''}`}
          key={`${String(ele)}-${idx}`}>
          <span className='dl-title'>{ele.title}</span>
          {ele.description && <div className='dl-description'>{ele.description}</div>}
          <div className='dl-date'>{ele.date}</div>
          {isPassed && <span className='past-badge'>Past</span>}
        </div>
      );
    });

    return (
      <div className=''>
        <div className='container'>
          <div className='venue-section'>
            <h3 className='title'>Important Dates</h3>
            <div className='dates-list'>
              {dates}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dates;
