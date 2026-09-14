import { Component } from "react";
import "./CFP.scss";
export default class CFP extends Component {
static displayName = "CFP";
render() {
return (
<div className="container">
  <div className="con-page">
    <div className="text-area">
    <div>
      {/* Opening */}
      <p className="tab-paragraph">Calling all Signal Makers!</p>
  	  <p className="tab-paragraph">TL;DR - submit via  {" "}
			<a
				href="https://forms.gle/EJr4EK7NjZeDyBZb8"
				className="text-highlight"
				rel="noopener noreferrer"
				target="_blank">
			this form
			</a> (but you really should read the instructions).
		</p>
      <p className="tab-paragraph">
        The Kernelcon Crew is soliciting presentations for the eighth annual Kernelcon,
        held at the Hilton Downtown in Omaha, NE, March 4-5, 2027.
      </p>
      <p className="tab-paragraph">
        Have you built something that slaps? Dropped a track the community needs to hear?
        Whether you're exploiting beats or exploiting binaries, if your work hits hard and
        teaches something real, we want it on our stage. Submit your talk to the CFP!
      </p>
      <p className="tab-paragraph">
        As you plan your submission, feel free to peruse the{" "}
        <a href="http://2019.kernelcon.org/agenda" className="text-highlight" target="_blank" rel="noopener noreferrer">2019</a>,{" "}
        <a href="https://2020.kernelcon.org/agenda#schedule" className="text-highlight" target="_blank" rel="noopener noreferrer">2020</a>,{" "}
        <a href="http://2022.kernelcon.org/agenda" className="text-highlight" target="_blank" rel="noopener noreferrer">2022</a>,{" "}
        <a href="http://2023.kernelcon.org/agenda" className="text-highlight" target="_blank" rel="noopener noreferrer">2023</a>,{" "}
        <a href="http://2024.kernelcon.org/agenda" className="text-highlight" target="_blank" rel="noopener noreferrer">2024</a>,{" "}
        <a href="http://2025.kernelcon.org/agenda" className="text-highlight" target="_blank" rel="noopener noreferrer">2025</a>,{" "}
        or{" "}
        <a href="http://2026.kernelcon.org/agenda" className="text-highlight" target="_blank" rel="noopener noreferrer">2026</a>{" "}
        programs for inspiration.
      </p>

      {/* Important Dates */}
      <p className="tab-heading">Important Dates</p>
      <p className="tab-paragraph">
        CFP dates can always be found on our{" "}
        <a href="/dates" className="text-highlight" target="_blank" rel="noopener noreferrer">important dates page</a>,
        which will always have the most current information. Make sure to pay attention to that page so you don't miss the window to submit your talk!
      </p>

      {/* Suggested Topic Areas */}
      <p className="tab-heading">Suggested Topic Areas</p>
      <p className="tab-paragraph">
        The theme for Kernelcon 2027 is <strong>Algo(Rhythm)</strong> — where security
        meets sound, pattern, and signal. We're tuned in to the beat of the hacking
        community and want talks that move the crowd.
      </p>
      <p className="tab-paragraph">
        Kernelcon submissions should focus on topics that interest the security and
        hacking communities. The list below is meant as a guide, not an exhaustive list:
      </p>
      <ul className="real-bullet-list">
        <li>Vulnerability research and novel exploit techniques</li>
        <li>Reverse engineering: software, firmware, and hardware</li>
        <li>Cryptography — attacks, implementations, and missteps</li>
        <li>Network protocol analysis, fuzzing, and manipulation</li>
        <li>AI and machine learning in offensive and defensive security</li>
        <li>Signal intelligence: RF, SDR, and wireless protocol attacks</li>
        <li>Red team operations and adversary simulation</li>
        <li>Incident response, threat hunting, and digital forensics</li>
        <li>Supply chain and hardware implant research</li>
        <li>OSINT, social engineering, and human factors</li>
        <li>Privacy, anonymity, and surveillance evasion</li>
        <li>Embedded systems and IoT hacking</li>
        <li>CTF design, game theory, and competitive hacking</li>
        <li>Security culture, community, and the human side of the craft</li>
        <li>War stories: lessons from real incidents and ops</li>
        <li>BeyondCorp / Zero Trust for modern distributed teams</li>
      </ul>
      <p className="tab-paragraph">
        If your talk doesn't fit precisely into one of these areas but you still think
        it's a good fit, please submit it for consideration! The suggested topics are
        meant only to provide some direction, not as a strict pedantic gate through
        which all submissions must pass.
      </p>

      {/* Conference Format */}
      <p className="tab-heading">Conference Format</p>
      <p className="tab-paragraph">
        Kernelcon 2027 will feature three concurrent main tracks. Talks may be 60 minutes
        (FULL) or 20 minutes (SHORT). Presentations typically run 50 or 15 minutes,
        leaving time for questions.
      </p>
      <p className="tab-paragraph">
        Speakers will be positioned at the front of a hotel conference area and will
        present using typical conference equipment.
      </p>

      {/* Speaker Benefits */}
      <p className="tab-heading">Speaker Benefits</p>
      <p className="tab-paragraph">
        Speakers receive complimentary admission to Kernelcon and will be recognized as
        a speaker via a special "SPEAKER" badge. Speakers also have the option of
        attending an exclusive speaker party preceding the conference. Details will
        be sent to accepted speakers following acceptance notification.
      </p>
      <p className="tab-paragraph">FULL talk speakers may also choose one of the following:</p>
      <ul className="real-bullet-list">
        <li>2 additional "HACKER" registrations</li>
        <li>$200 donation to the EFF or Hackers for Charity</li>
        <li>$200 honorarium</li>
        <li>Reinvest in making Kernelcon even better next year</li>
      </ul>
      <p className="tab-paragraph">
        Backup/alternate talks may also be tentatively accepted. These speakers will
        receive admission and may be asked to present if needed.
      </p>

      {/* Review Process */}
      <p className="tab-heading">Review Process</p>
      <p className="tab-paragraph">
      Our review process is not as formal as some academic conferences. However,
      submissions are considered confidential and are not shared outside of the
      Technical Program Committee. Every submission is reviewed by multiple committee
      members and weighed for inclusion in the program. TPC Committee members are
      selected for the ability to provide valuable reviews, handle sensitive
      information, and remain fair, impartial, and consistent in the review process.
      Ultimately the committee informs the TPC Chair(s) who set the technical portion
      of the program that is married with the rest of Kernelcon agenda.
      </p>
      <p className="tab-paragraph">
      Novel, new, on-topic talks receive the most preference. Submissions by
      first-time presenters are not discounted in any way. Quite the opposite!
      First-timers are whole-heartedly encouraged to submit. Blatant vendor pitches,
      recycled talks, presentations on well-known topics that are *not* depicted as
      101 or intro, are unlikely to be accepted. We expect presentations that are
      considerate, planned, thought-out, and delivered well. All talks are
      considered on their merits. Everyone, including sponsors, internet legends,
      cultural icons, and Dave Kennedy must submit just like all other speakers.
      </p>

      {/* How to Submit */}
      <p className="tab-heading">How to Submit</p>
      <p className="tab-paragraph">Speakers must submit directly; no PR reps permitted.</p>
      <p className="tab-paragraph">
        Information you'll need for your submission:

      <ul className="real-bullet-list no-bullets">
			<li><input className="fake-checkbox" type="checkbox"/>Speaker name(s)</li>
			<li><input className="fake-checkbox" type="checkbox"/>Speaker Name(s), Pseudonym(s), or handle(s) </li>
			<li><input className="fake-checkbox" type="checkbox"/>Speaker Company or affiliation </li>
			<li><input className="fake-checkbox" type="checkbox"/>Speaker headshot </li>
			<li><input className="fake-checkbox" type="checkbox"/>Contact information (email, twitter, phone, etc - if we need to reach you and we can't, that's on you) *</li>
			<li><input className="fake-checkbox" type="checkbox"/>Speaker promotion information (twitter, facebook, etc) - if we want to promote your talk specifically, and you want us to tag you</li>
			<li><input className="fake-checkbox" type="checkbox"/>Presentation Title</li>
			<li><input className="fake-checkbox" type="checkbox"/>Decide if you'd like your submission to be presented to the program committee anonymously for review</li>
			<li><input className="fake-checkbox" type="checkbox"/>Read "Grant of Copyright Use" and "Speaker Terms" copied and completed from below</li>
			<li><input className="fake-checkbox" type="checkbox"/>URL for any optional supplementary files (URL because you're sharing them with us)</li>
			<li><input className="fake-checkbox" type="checkbox"/>Timeslot (20 or 60 minutes)</li>
			<li><input className="fake-checkbox" type="checkbox"/>Abstract of your presentation (1200 characters or less) **</li>
			<li><input className="fake-checkbox" type="checkbox"/>Speaker Bio (500 characters or less)</li>
			<li><input className="fake-checkbox" type="checkbox"/>Technical Level of talk: on a 1 (none) to 5 (all the way down the rabbit hole) scale</li>
			<li><input className="fake-checkbox" type="checkbox"/>Detailed Description: <span className="text-highlight">the most important part</span> of your submission. You need to provide detailed information that demonstrates your knowledge of your topic and how you will present it to the audience. Do not rely on your abstract to be enough for the reviewers. It isn't. If your talk will include demos, new exploits, tool releases or audience interactions, please include details.</li>
			<li><input className="fake-checkbox" type="checkbox"/>Why do you feel this submission is a good fit for Kernelcon?</li>
			<li><input className="fake-checkbox" type="checkbox"/>List of other venues or where this work has been presented, published or derived from</li>
			<li><input className="fake-checkbox" type="checkbox"/>Are you a potential first time conference speaker?</li>
			<li><input className="fake-checkbox" type="checkbox"/>List of facilities requested beyond what is already provided (power, projector, podium, sound projection, and internet connectivity).</li>
			<li><input className="fake-checkbox" type="checkbox"/>Press can contact you: yes or no</li>
			<li><input className="fake-checkbox" type="checkbox"/>For FULL talks, honorarium choice: Donate (EFF or HFC), Registrations (2), Cash, Reinvest</li>
      </ul>
      </p>
      <p className="tab-paragraph">Incomplete or misformatted submissions greatly reduce the likelihood of your talk being accepted.</p>
      <p className="tab-paragraph">
        If you run into issues, or have questions inquire at {" "}
        <a href="mailto:cfp@kernelcon.org" className="text-highlight" target="_blank" rel="noopener noreferrer">
          cfp@kernelcon.org
        </a>.
      </p>
      <p className="tab-paragraph">
        Supplementary files like draft slides, outlines, or whitepapers may also be
        included via URL (Dropbox, Drive, etc.).
      </p>
  		<p className="tab-paragraph">We're continuing into our 3rd year of a form-based CFP submission system rather than email.</p>
	    <p className="tab-paragraph">Submissions are collected by {" "}
			<a
				href="https://forms.gle/EJr4EK7NjZeDyBZb8"
				className="text-highlight"
				rel="noopener noreferrer"
				target="_blank">
			form
			</a>{""}. </p>

      {/* Grant of Copyright */}
      <p className="tab-heading">Grant of Copyright Use</p>
		  <p className="tab-paragraph">I warrant that the above work has not been previously
      published elsewhere, or if it has, that I have obtained permission for its
      publication by Kernelcon and that I will promptly supply Kernelcon with wording
      for crediting the original publication and copyright owner. If I am selected for
      presentation, I hereby give Kernelcon permission to duplicate, record, and
      redistribute this presentation, which includes, but is not limited to, any
      conference proceedings, conference CD, video, audio, and handouts to the conference
      attendees for educational, on-line, and all other purposes.</p>

      <p className="tab-paragraph">
        By submitting your talk proposal, you agree to the Grant of Copyright Use.
      </p>

      {/* Terms of Speaking */}
      <p className="tab-heading">Terms of Speaking Requirements</p>
      <ol className="real-bullet-list">
			<li>I will submit a completed presentation, a copy of the tool(s) and/or code(s), and a reference to all of the tool(s), law(s), web sites and/or publications referenced at the end of my talk and as described in this CFP submission for publication by Kernelcon.</li>
			<li>I will submit any revisions to the originally submitted Title, Abstract and Biography for the Kernelcon website and printed conference materials by March 3, 2027.</li>
			<li>I will complete my presentation within the time allocated to me - not running over, or excessively under, the time allocation.</li>
			<li>I understand that the Kernelcon venue will provide 1 projector feed, microphone(s), wired and/or wireless Internet. I understand that I am responsible for providing all other necessary equipment, including laptops and machines, to complete my presentation.</li>
			<li>I understand that I will be responsible for my own hotel and travel expenses.</li>
      </ol>
      <p className="tab-paragraph">
        By submitting your talk proposal, you agree to these Terms of Speaking.
      </p>
    </div>
  </div>
  </div>
</div>

);
}
}
