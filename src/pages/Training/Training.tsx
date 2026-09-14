import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Training.scss';

import { trainingConfig as config } from '../../content';

interface Instructor {
  name: string;
  title?: string;
  twitter_handle?: string;
  github_handle?: string;
  linkedin_handle?: string;
  workplace?: string;
  image_name?: string;
  bio?: string;
}

interface Course {
  title: string;
  days: number;
  time: string;
  description: {
    long_form?: string;
    short_form: string;
  };
  prerequisites?: string;
  equipment?: string;
  whoshouldattend?: string;
}

interface TrainingItem {
  id: string;
  hide?: boolean;
  day?: number;
  instructors: Instructor[];
  course: Course;
}

class Training extends Component {
  static displayName = 'Training';

  render() {
    // constants, can change from year to year.  Along with config update, should generate new training content.
    const baseUrl = 'training';
    const dayOneTraining = 'Monday, March 2nd';
    const dayTwoTraining = 'Tuesday, March 3rd';
    const trainingYear = '2027';

    // course descriptions may require their own html (i.e. when instructors put bullets or multiple paragraphs)
    function createMarkup(ele: string) {
      return {__html: ele};
    }

    const filteredTraining = (config as TrainingItem[]).filter(ele => !ele.hide);
    const sortedAndFilteredTraining = filteredTraining.sort((a, b) => {
      return a.course.title.localeCompare(b.course.title);
    });

    const training = sortedAndFilteredTraining.map((ele, idx) => {
      const instructors = ele.instructors.map((el, idx) => {
        return (
          <div className='training-instructor text-highlight' key={idx}>
            <Link
              to={{ pathname: '/bio/' }}
              state={{
                name: el.name,
                bio: el.bio,
                twitter: el.twitter_handle,
                linkedin: el.linkedin_handle,
                image: el.image_name
              }}
            >
              {el.name}
            </Link>
          </div>
        );
      });

      return (
        <>
          <div className='training-card'
            key={`${ele.id}-${idx}`}
            id={ele.id}>
            <a href={`/${baseUrl}#${ele.id}`}>
              <div className='training-title'>
                <span>{ele.course.title}</span>
                <span>$1,200</span>
              </div>
            </a>
            <div className='training-notes'>
              <div className='training-notes-left'>
                <div className='training-instructors'>
                  <div className='training-heading'>{ele.instructors.length > 1 ? 'Instructors' : 'Instructor'}:</div>
                  <div className='training-instructor-names'>{instructors}</div>
                </div>
                <div className='training-format'>
                  <div className='training-heading'>Format:</div>
                  <div>{ele.course.days} {ele.course.days > 1 ? 'days training' : 'day training'}</div>
                </div>
                <div className='training-format'>
                  <div className='training-heading'>{ele.course.days > 1 ? 'Dates:' : 'Date:'}</div>
                  <div>{ele.course.days > 1 ? `${dayOneTraining} and ${dayTwoTraining}, ${trainingYear}` : ele.day && ele.day > 1 ? `${dayTwoTraining}, ${trainingYear}`: `${dayOneTraining}, ${trainingYear}`}</div>
                </div>
                <div className='training-format'>
                  <div className='training-heading'>{ele.course.days > 1 ? 'Times:' : 'Time:'}</div>
                  <div>{ele.course.days > 1 ? `${ele.course.time} each day` : ele.course.time}</div>
                </div>
              </div>
              <div className='training-notes-right'>
                <a
                  className="cybr-btn btn-bottom"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://reg.kernelcon.org/e/2138684337">
                  Register Now
                  <span aria-hidden className="cybr-btn__glitch">
                    Register Now
                  </span>
                </a>
              </div>
            </div>

            <div className='training-equipment'>
              <div className='training-heading'>Description:</div>
              <div className='training-text' dangerouslySetInnerHTML={createMarkup(ele.course.description.short_form)} />
            </div>

            {ele.course.prerequisites && <div className='training-prereqs'>
              <div className='training-heading'>Prerequisites:</div>
              <div className='training-text' dangerouslySetInnerHTML={createMarkup(ele.course.prerequisites)} />
            </div>}
            {ele.course.equipment && <div className='training-equipment'>
              <div className='training-heading'>Required Equipment:</div>
              <div className='training-text' dangerouslySetInnerHTML={createMarkup(ele.course.equipment)} />
            </div>}
            {ele.course.whoshouldattend && <div className='training-equipment'>
              <div className='training-heading'>Who Should Attend:</div>
              <div className='training-text' dangerouslySetInnerHTML={createMarkup(ele.course.whoshouldattend)} />
            </div>}
          </div>
        </>
      );
    });

    return (
      <div className="container">
        <div className='training'>
          <div className='venue-section'>
            <h3>Training</h3>
            {/* <p>Once again Kernelcon will be offering several amazing options for training taking place in the days before the con.  Check back soon for more details or if you're interested in leading a training class, checkout our <a rel="noopener noreferrer" className="text-highlight" href="/open-calls">Open Calls page</a> for more details.</p> */}
            <div>
            <br /><p>Kernelcon Training offers courses from experienced trainers on relevant topics in information security. These are hands-on, in-person courses that will help expand attendees' skill sets and knowledge. Kernelcon's goal is to provide top-notch training at an affordable price. Each training ticket includes a badge to the Kernelcon conference and snacks and lunch during training. Whether new to the field or an old blackhat, offense or defense, technical or general, or anything and everything inbetween, we hope you find something you like.</p>
          </div>
          {training}
          </div>
          
          <div className='venue-section' style={{ marginTop: '60px' }}>
            <h3>Workshops</h3>
            <div>
              <br /><p>In addition to our comprehensive training courses, Kernelcon offers specialized workshops that provide unique learning opportunities. These workshops are designed to expand your skillset beyond traditional security topics and explore exciting intersections of technology and communication.</p>
            </div>
            
            <div className='training-card'
              key='ham-radio-workshop'
              id='ham-radio-workshop'>
              <a href={`/${baseUrl}#ham-radio-workshop`}>
                <div className='training-title'>
                  <span>Ham Radio Workshop</span>
                  <span>$370*</span>
                </div>
              </a>
              <div className='training-notes'>
                <div className='training-notes-left'>
                  <div className='training-format'>
                    <div className='training-heading'>Format:</div>
                    <div>1 day workshop</div>
                  </div>
                  <div className='training-format'>
                    <div className='training-heading'>Date:</div>
                    <div>Tuesday, March 3rd, 2027</div>
                  </div>
                  <div className='training-format'>
                    <div className='training-heading'>Pricing:</div>
                    <div>Ham workshop included FREE with special Kernelcon registration</div>
                  </div>
                </div>
                <div className='training-notes-right'>
                  <a
                    className="cybr-btn btn-bottom"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://reg.kernelcon.org/e/2138684337">
                    Register Now
                    <span aria-hidden className="cybr-btn__glitch">
                      Register Now
                    </span>
                  </a>
                </div>
              </div>

              <div className='training-equipment'>
                <div className='training-heading'>Description:</div>
                <div className='training-text'>
                  <p>Get ready to dive into the fascinating world of amateur radio! This hands-on Ham Radio Workshop takes place the day before Kernelcon kicks off, giving you the perfect opportunity to expand your communication skills and explore a critical technology that bridges emergency response, cybersecurity, and off-grid communication.</p>
                  <p>Whether you're interested in emergency communications, radio frequency security, or just want to learn a new skill that connects you to a global community of operators, this workshop will get you started on your ham radio journey. You'll learn the fundamentals of radio operation, licensing requirements, equipment basics, and practical communication techniques.</p>
                  <p><strong>Upon completion of this workshop, attendees will be qualified to test for their HAM radio license</strong> - opening doors to a world of communication possibilities and emergency preparedness skills that complement your security expertise.</p>
                  <p style={{ marginTop: '15px', fontStyle: 'italic' }}>*$370 covers a Kernelcon conference ticket with the Ham Radio Workshop included at no additional cost. This special registration includes overhead and operating costs for both the conference and workshop.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Training;
