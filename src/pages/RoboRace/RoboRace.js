import React, { Component } from 'react';
import './RoboRace.scss';


class RoboRace extends Component {
  static displayName = 'RoboRace';

  render() {
    return (
      <div className=''>
        <div className='container'>
          <div className='venue-section'>
            <div className="con-page">
                <div className="text-area">
                    <h3 className="title">Line-Following Robot Competition</h3>
                    <p className="tab-paragraph">The Kernelcon Crew is excited to expand our Side Quests competition with a <b>Line-Following Robot Race!</b>  The line-following competition is one of the most popular robotics compeitions in the world and Kernelcon is proud to host an event for our attendees.  These types of events are traditionally held at massive robotic conferences or coastal college competitions, but we are interested in seeing what our attendees can pull together. This page is going to cover the rules of the competition, hints and tricks, and things you can do to prepare for the event.</p>

                    <div className="tab-title">Description</div>
                    <p className="tab-paragraph">
                        Your line-following robot will follow a 0.75-inch, black line made of electrical tap across a course as fast as possible.  Robots will have to navigate tricky obstacles, including turns, intersections, and elevation changes.  Each missed obstacle adds time to the total run.  If your robot is unable to finish you will be allowed re-attempts.  Since this is a learning competition, we will allow re-programming between attempts.
                    </p>

                    <div className="tab-title">Kits</div>
                    <p className="tab-paragraph">We highly encourage you to come with your own builds. In fact, there might be some custom swag for participants who bring their own robot for the competition. However, we understand that not everyone can participate so we plan on having several kits built for the robo-curious to try or play with.  If you are interested in bringing your own robot, there are many kits available online including: these kits from {" "}
                        <a
                            href="https://www.amazon.com/s?k=line+following+robot+kit&crid=1G9JVQSM7R7XZ&sprefix=line+followin%2Caps%2C128&ref=nb_sb_ss_mvt-t5-ranker_2_13"
                            className="text-highlight"
                            rel="noopener noreferrer"
                            target="_blank">
                            Amazon
                        </a>{""}, or several options on {" "}
                        <a
                            href="https://www.newegg.com/p/pl?d=line+following+robot"
                            className="text-highlight"
                            rel="noopener noreferrer"
                            target="_blank">
                            NewEgg
                        </a>{""}, and of course plenty of {" "}
                        <a
                            href="https://www.parallax.com/product/qti-line-follower-appkit-for-the-small-robot/"
                            className="text-highlight"
                            rel="noopener noreferrer"
                            target="_blank">
                            Arduino-based kits
                        </a>{""} are available too.
                    </p>
                    <p className='tab-paragraph'>Lastly, we have soldering stations in our HHV in case you want to build your robot on site.  You have two whole days to finesse, program, and tweak your build and we will do all we can to enable you along the way!</p>

                    <div className="tab-title">Rules (Fine Print)</div>
                    <p className="tab-paragraph">
                        <ul className='rules'>
                            <li><b>Runs: </b>Each competitor gets <b>five total runs</b>, and the best time is what is ultimately scored.</li>
                            <li><b>Course Time: </b>Time is measured from the time the robot crosses the starting line until the time it crosses the finish line. A robot is deemed to have crossed the line when the forward most wheel, track, or leg of the robot contacts or crosses over the line.</li>
                            <li><b>Time Limit: </b>A maximum of 6 minutes is allowed for a robot to complete the course. A robot that cannot complete the course in the allotted time shall be disqualified.</li>
                            <li><b>Timekeeping: </b>Time shall be measured by an electronic gate system or by a judge with a stopwatch, based on the availability of equipment. In either case the recorded time shall be final.</li>
                            <li><b>Autonomous Control: </b>Once a robot has crossed the starting line it must remain fully autonomous, or it will be disqualified.</li>
                            <li><b>Arena Edges: </b>A robot that wanders off of the arena surface will be disqualified. A robot shall be deemed to have left the arena when any wheel, leg, or track has moved completely off the arena surface.</li>
                            <li><b>Losing the Line: </b>Any robot that loses the line course must reacquire the line at the point where it was lost, or at any earlier (e.g. already traversed) point.</li>
                            <li><b>Power of Officials: </b>The decisions of all officials regarding these rules and the conduct of the event shall be final.</li>
                            <li><b>Additional Attempts: </b>Any robot that loses the line course and fails to reacquire it will be allowed four reattempt runs. The robot must start the course again from the beginning, and if it loses the line course on its fifth attempt it will be disqualified.</li>
                            <li><b>Size and Weight Limits: </b>There are no strict limits on size or weight, you can expect to have 6 inches minimum on either side of the line.</li>
                        </ul>
                    </p>

                </div>
                <div className='dancing-robots'>
                    {/* Credit - https://codepen.io/c4rin3/pen/BaJwBo */}
                    <div class="robot1"></div>
                    <div class="robot2"></div>
                    <div class="robot3"></div>
                    <div class="robot4"></div>
                    <div class="robot5"></div>
                    <div class="robot1"></div>
                    <div class="robot2"></div>
                    <div class="robot3"></div>
                    <div class="robot4"></div>
                    <div class="robot5"></div>
                </div>

                <div className="text-area">
                    <p className="tab-paragraph">Chaotic Inspiration provided by {" "}
                        <a
                            href="https://www.youtube.com/watch?v=skOHlrX_U5g&ab_channel=OpenSauce"
                            className="text-highlight"
                            rel="noopener noreferrer"
                            target="_blank">
                            William Osman & OpenSauce.
                        </a>{""}.
                    </p>
                    <p className="tab-paragraph yt-vid">
                        <iframe width="570" height="332" src="https://www.youtube.com/embed/skOHlrX_U5g" title="We Hosted a 24 Hour Hackathon" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoboRace;


