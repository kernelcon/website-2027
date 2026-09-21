import { Component } from 'react';
import './OpenCalls.scss';

export default class Villages extends Component {
  static displayName = 'Call for Villages';

  render() {
    return (
      <div>
        <p className='tab-paragraph'>
          The Call for Villages is <strong>open</strong>! Kernelcon 2027 is looking for
          community villages to help make the conference an immersive, hands-on experience.
          Villages are a highlight of Kernelcon — interactive spaces where attendees can
          learn, compete, and connect.
        </p>
        <p className='tab-paragraph' style={{fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', letterSpacing: '0.08em', padding: '0.75rem 1rem', border: '1px solid rgba(255,230,0,0.4)', borderLeft: '4px solid #ffe600', background: 'rgba(255,230,0,0.05)', color: 'rgba(255,255,255,0.85)'}}>
          ⚠ <strong>SPACE IS LIMITED.</strong> Village slots are allocated on a rolling basis — when the floor fills up, it fills up. There is no waitlist guarantee. Submit early.
        </p>
        <p className='tab-paragraph'>
          If you are interested in running a Village at Kernelcon 2027 (March 4–5, Hilton
          Downtown Omaha), here are some things to know up front:
        </p>
        <div className='tab-bullets'>
          <ul>
            <li>Villages are expected to be open both Friday and Saturday, during conference hours.</li>
            <li>Information provided about the village will be used for art, marketing, announcements, and the program.</li>
            <li><strong>Space is physically limited</strong> — slots are first-come, first-allocated. The deadline is January 7, 2027, but don't wait on it.</li>
            <li>If your village plans to sell any items, you are solely responsible for complying with all applicable sales tax laws and regulations. Kernelcon is not responsible for any sales, transactions, or tax obligations conducted by your village.</li>
          </ul>
        </div>
        <p className='tab-heading'>Submission Requirements</p>
        <p className='tab-paragraph'>
          If you are interested in running a Village, email{' '}
          <a href='mailto:villages@kernelcon.org' className='text-highlight' rel='noopener noreferrer'>
            villages@kernelcon.org
          </a>{' '}
          with the following information (one form per Village). Please be as detailed as
          possible so our review board can best evaluate your submission. All submissions
          are due by <strong>January 7, 2027</strong>.
        </p>
        <p className='tab-paragraph'>
          After your submission is received, we will respond and let you know we got it.
          If you have not received confirmation after two business days, contact{' '}
          <a href='mailto:villages@kernelcon.org' className='text-highlight' rel='noopener noreferrer'>
            villages@kernelcon.org
          </a>.
        </p>
        <p className='tab-heading'>Kernelcon 2027 Village Application must include:</p>
        <p className='tab-paragraph'>
          <ol className='tab-ordered-list'>
            <li>Village Name</li>
            <li>A full description of your Village (used for art, marketing, and announcements)</li>
            <li><em>For Kernelcon internal use only:</em> Organizer name, email address, phone number (emergency use only)</li>
            <li><em>For Kernelcon website:</em> Organizer name, social handle (if desired), and biography</li>
            <li>Official web address/URL for your Village, if available</li>
            <li>Whether you plan to have talks, contests, or events within the village</li>
            <li>Any equipment or space requirements beyond standard tables and power</li>
            <li>Submit as plain text in the email body, or attach as .docx or .txt</li>
          </ol>
        </p>
        <p className='tab-heading'>What Kernelcon Will Provide</p>
        <p className='tab-paragraph'>
          <ol className='tab-ordered-list'>
            <li>Village space on the conference floor for both Friday and Saturday during conference hours.</li>
            <li>Setup time on Thursday prior to the event to get your village ready before doors open.</li>
            <li>Standard tables and power at your space.</li>
            <li>Village advertisement and promotion via website, social media, and other means.</li>
            <li>Complimentary admission to Kernelcon for village organizers.</li>
            <li>Snacks for village organizers (and attendees).</li>
            <li>Wi-Fi and general venue support.</li>
          </ol>
        </p>

        <p className='tab-heading'>In Closing</p>
        <p className='tab-paragraph'>We will be in communication with you throughout this process. If we need more information or clarification, we will reach out. When a decision is made, we will promptly let you know whether you have been accepted. If you have any questions at any point, don't hesitate to reach out to <a href='mailto:villages@kernelcon.org' className='text-highlight' rel='noopener noreferrer'>villages@kernelcon.org</a>.</p>
        <p className='tab-paragraph'>Good luck — we can't wait to see what you're building!</p>
      </div>
    );
  }
}
