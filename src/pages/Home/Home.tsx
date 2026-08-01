import { Component } from "react";
import BackGround from '../../components/BackGround/BackGround';

import "./Home.scss";

interface HomeState {
  mode: string;
  isOpen: boolean;
}

export default class Home extends Component<object, HomeState> {
  static displayName = "Home";

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  getRandomPic(lengthOfArray: number, indexToExclude: number, secondLastKernelIndex: number) {
    // This function just grabs a random index that wasn't one of the last two.
    // Obviously, due to math, you need to send in at least an array of length 3.
    let rand: number | null = null;

    while (rand === null || rand === indexToExclude || rand === secondLastKernelIndex) {
      rand = Math.round(Math.random() * (lengthOfArray - 1));
    }
    return rand;
  }


  constructor(props: object) {
    super(props);
    this.state = {
      mode: "",
      isOpen: false,
    };
  }

  render() {
    return (
      <div id='main_hero' className='hero'>
        <BackGround />
        <div className="container">
          <div className="home-page">
            <div className="centered-top">
            </div>

            {/* <div className="col left">
              <div className="sizzle">
                <div className="sizzle-header">
                  <div className="sizzle-text-title">
                    Welcome to Kernelcon
                  </div>
                </div>
                <div className="sizzle-text-section">
                  <div className="sizzle-text">
                    Rev up and put the pedal to the metal at one of the midwest's premier information security conferences.
                  </div>
                  <div className="sizzle-bullets">
                    <div className='sizzle-bullet-item'>
                      <div className='sizzle-icon'>
                        <img src={Speakers} alt="speaker-logo"/>
                      </div>
                      <div className='sizzle-bullet'>
                        <div className='sizzle-bullet-title'>
                          Excellent Speakers
                        </div>
                        <div className='sizzle-bullet-desc'>
                          We are speeding in some of information security's top talents from the midwest and across the nation. Come learn from and network with our speakers!
                        </div>
                      </div>
                    </div>
                    <div className='sizzle-bullet-item'>
                      <div className='sizzle-icon'>
                        <img src={Training} alt="training-logo"/>
                      </div>
                      <div className='sizzle-bullet'>
                        <div className='sizzle-bullet-title'>
                          Professional Training
                        </div>
                        <div className='sizzle-bullet-desc'>
                          Some of the industry's leading trainers descend on Omaha, Nebraska to lead two days of intensive coursework for attendees. This training is often offered at a FRACTION of costs at large hacker conferences.
                        </div>
                      </div>
                    </div>
                    <div className='sizzle-bullet-item'>
                      <div className='sizzle-icon'>
                        <img src={Garage} alt="hands-on-logo"/>
                      </div>
                      <div className='sizzle-bullet'>
                        <div className='sizzle-bullet-title'>
                          Hands-On Villages
                        </div>
                        <div className='sizzle-bullet-desc'>
                        Enter the garage and we'll have all the tools - including classics like Hardware Hacking and Radio Hacking. Got an idea for a fun village? Reach out!
                        </div>
                      </div>
                    </div>
                    <div className='sizzle-bullet-item'>
                      <div className='sizzle-icon'>
                        <img src={CarRace} alt="competitions-logo"/>
                      </div>
                      <div className='sizzle-bullet'>
                        <div className='sizzle-bullet-title'>
                          Challenging Competitions
                        </div>
                        <div className='sizzle-bullet-desc'>
                          Race to the finish line, our Capture-the-Flag event is always a big hit and last year's Side Quests helped find the most well-rounded hacker. This year promises not to disappoint - join us in a race to win an eternal kernel aka lifetime entry to Kernelcon!
                        </div>
                      </div>
                    </div>
                    <div className='sizzle-bullet-item'>
                      <div className='sizzle-icon'>
                        <img src={DriverCelebrate} alt="activities-logo"/>
                      </div>
                      <div className='sizzle-bullet'>
                        <div className='sizzle-bullet-title'>
                          Fun Activities
                        </div>
                        <div className='sizzle-bullet-desc'>
                          Come chill out with us at the Race pit.  Our raging party / social event, Kernel Panic, is always an attendee favorite!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>


            <div className="col right">

              <span className='centered-top'>
                <div className='order-button'>
                  <a
                    className="cybr-btn btn-bottom"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.eventzilla.net/e/kernelcon-2025-2138626943">
                    Register Now
                    <span aria-hidden className="cybr-btn__glitch">
                    Register Now
                    </span>
                  </a>
                </div>
              </span>

              <div className='update-section'>
                <h2 className='centered'>Kernelcon Updates</h2>
                <p className='update-text'>As we continue to tinker in the garage, please check back here for updates and announcements. Click on each update to be taken to their individual pages for more details.</p>
                <div className='updates'>
                                    <h3 className='update-announcement'>New Keynotes Announced</h3>
                  <div className='keynote-section'>
                    <a className='keynote-anchor'
                      href="https://kernelcon.org/agenda">
                      <div className='keynote keynote-bkg'>
                        <img
                          src={Gabrielle}
                          className="update-keynote"
                          alt="Gabrielle Hempel"
                        />
                        <div className="keynote-name">Gabrielle Hempel</div>
                      </div>
                    </a>
                    <a className='keynote-anchor'
                      href="https://kernelcon.org/agenda">
                    <div className='keynote keynote-bkg'>
                      <img
                        src={JaysonStreet}
                        className="update-keynote"
                        alt="Jayson Street"
                      />
                      <div className="keynote-name">Jayson Street</div>
                    </div>
                    </a>
                    <a className='keynote-anchor'
                      href="https://kernelcon.org/agenda">
                    <div className='keynote keynote-bkg'>
                        <img
                          src={JeffMan}
                          className="update-keynote"
                          alt="Jeff Man"
                        />
                        <div className="keynote-name">Jeff Man</div>
                      </div>   
                    </a>  
                  </div>
                  <h3 className='update-announcement'>New Entertainment Announced</h3>
                  <div className='keynote-section'>
                    <a className='keynote-anchor'
                      href="https://kernelcon.org/agenda">
                      <div className='keynote keynote-bkg'>
                        <img
                          src={YTCracker}
                          className="update-keynote"
                          alt="ytcracker"
                        />
                        <div className="keynote-name">YTCracker</div>
                      </div>
                    </a>
                    <a className='keynote-anchor'
                      href="https://kernelcon.org/agenda">
                    <div className='keynote keynote-bkg'>
                      <img
                        src={DualCore}
                        className="update-keynote"
                        alt="DualCore"
                      />
                      <div className="keynote-name">int eighty of Dual Core</div>
                    </div>
                    </a> 
                  </div>
                </div>
              </div>
            </div> */}



          </div>
        </div>
      </div>
    );
  }
}
