import { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from '../../components/ui/Tabs';
import MediaQuery from 'react-responsive';
import Speakers from './Speakers/Speakers';
import Talks from './Talks/Talks';

import TalksSchedule from './TalksSchedule/TalksSchedule';
// import ConSchedule from './ConSchedule'
// import TrainingSubmissions from './TrainingSubmission';
// import Workshops from './Workshops';

import CallOuts from '../../components/CallOuts/CallOuts';
import type { ComponentProps } from 'react';
import Casey from "../../static/images/speakers/Casey.png";
import Phillip from "../../static/images/speakers/Phillip.jpg";

import { villageConfig, competitionConfig, entertainmentConfig, careersConfig } from '../../content';

import './Agenda.scss';

type CallOutsConfig = ComponentProps<typeof CallOuts>['config'];

import type { LegacyRouteProps } from '../../router-compat';

type AgendaProps = LegacyRouteProps;

interface AgendaState {
  defaultTab: string;
}

export default class Agenda extends Component<AgendaProps, AgendaState> {
  static displayName = 'Agenda';

  constructor(props: AgendaProps) {
    super(props);
    this.state = {
      defaultTab: 'schedule' // default tab if none specified
    };
  }

  componentDidMount() {
    const { tabId } = this.props.match.params;
    if (tabId) {
      this.setState({ defaultTab: tabId });
    }
  }

  componentDidUpdate(prevProps: AgendaProps) {
    if (this.props.match.params.tabId !== prevProps.match.params.tabId) {
      const { tabId } = this.props.match.params;
      this.setState({ defaultTab: tabId || 'keynotes' });
    }
  }

  changeTab(tabId: string) {
    this.props.history.push(`/agenda/${tabId}`);
  }

  getTabs(vert: boolean) {
    return (
      <Tabs 
        defaultTab={this.state.defaultTab}
        onChange={(tabId) => this.changeTab(tabId)}
        vertical={vert}
      >
        <TabList>
          <Tab tabFor="schedule">Schedule</Tab>
          <Tab tabFor="keynotes">Keynotes</Tab>
          <Tab tabFor="speakers">Speakers</Tab>
          <Tab tabFor="talks">Talks</Tab>
          <Tab tabFor="villages">Villages</Tab>
          <Tab tabFor="competitions">Competitions</Tab>
          {/* <Tab tabFor="activities">Activities</Tab> */}
          <Tab tabFor="entertainment">Entertainment</Tab>
          <Tab tabFor="careers">Careers</Tab>
        </TabList>
        <TabPanel tabId="schedule">
          <div className='text-area'>
            <TalksSchedule />
          </div>
        </TabPanel>

        <TabPanel tabId="keynotes">
          <div className='text-area'>
            <h3 className='title'>Keynotes</h3>

            <div className='keynote-section'>
              <div className='keynote-left'>
                <h4 className='keynote-name'>Casey Ellis</h4>
                <div className='keynote-subtitle'>
                  <div className='keynote-company'>
                    <a href='https://cje.io/' target="_blank" rel="noopener noreferrer">
                      cje.io
                    </a>
                  </div>
                  <div className='keynote-div'>|</div>
                  <div className='keynote-handle'>
                    <a href='https://x.com/caseyjohnellis' target="_blank" rel="noopener noreferrer">
                      @caseyjohnellis
                    </a>
                  </div>
                </div>

                <div className='keynote-bio'>
                  <p className='tab-paragraph'> Casey is a serial entrepreneur and executive, best known as the founder of Bugcrowd and co-founder of The disclose.io Project. He is a 25+ year veteran of information security who grew up inventing things, hacking things, and generally getting technology to do things it isn't supposed to do. Casey pioneered the crowdsourced security as-a-service model, launching the first bug bounty programs on the Bugcrowd platform in 2012, and he co-founded disclose.io vulnerability disclosure standardization project in 2014 prior to its launch in 2018.</p>
                  <p className='tab-paragraph'> He’s an active member of a variety of policy and threat intelligence working groups and think tanks such as the Hacking Policy Council and the Election Security Research Forum. He has personally advised the US White House, DoD, Department of Justice, Department of Homeland Security/CISA, the Australian and UK intelligence communities, and various US House and Senate legislative cybersecurity initiatives, including preemptive cyberspace protection ahead of the 2020 and 2024 Presidential Elections, the US National Cyber Strategy, and a variety of policies and EO’s relating to security research, anti-hacking law, and artificial intelligence.</p>
                  <p className='tab-paragraph'> Casey, a native of Sydney, Australia, is based in the San Francisco Bay Area.</p>
                </div>

                {/* <div className='keynote-talk'>
                  <div className='keynote-topic'>In Search of Lost Bytes: Hardware Implants and the Trouble with Supply Chains</div>
                  <div className='keynote-abstract'>
                    <p className='tab-paragraph'>Digital markets have quickly grown to international proportions, complexities in materials, development, and distribution have developed accordingly, resulting in market efficiency and, often overlooked, incalculable risks.</p>
                    <p className='tab-paragraph'>There is a fine line between acceptable and irreconcilable risk, while some risks are mitigatable, others are not, and ignoring the facts has disproportionate consequences. This presentation will explore modern supply chain security risks through a technical deep dive of 5G infrastructure and the political battles surrounding it.</p>
                    <p className='tab-paragraph'>However, a wider acknowledgment of the supply chain problem doesn’t make it go away. We need to understand the inherent hardware vulnerabilities exposed. Currently, confidence in hardware security relies too much implicit trust — overlooking serious threats. Assurance in this area is hard won, manual, and costly.</p>
                    <p className='tab-paragraph'>To highlight this, several hardware implant techniques will be discussed, showcasing various attack methods as well as the point at which they are most likely to be exploited in a standard supply chain.</p>
                  </div>
                </div> */}
              </div>
              <div className='keynote-right'>
                <img src={Casey}
                  alt="Casey Ellis"
                  className='keynote-image'/>
              </div>
            </div>
            <div className='keynote-section'>
              <div className='keynote-left'>
                <h4 className='keynote-name'>Phillip Wylie</h4>
                <div className='keynote-subtitle'>
                  <div className='keynote-company'>
                    <a href='https://suzulabs.com/' target="_blank" rel="noopener noreferrer">
                      Suzu Labs
                    </a>
                  </div>
                  <div className='keynote-div'>|</div>
                  <div className='keynote-handle'>
                    <a href='https://x.com/PhillipWylie' target="_blank" rel="noopener noreferrer">
                      @PhillipWylie
                    </a>
                  </div>
                </div>

                <div className='keynote-bio'>
                  {/* <p className='keynote-bio-subtitle'>We all loved watching him <a className="text-highlight" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=AQpv_6Se6VM&list=PL9RA5HoG1guy7oz3m4Y0aHqsNumai2o8v&index=6">reverse engineer hardware components in Hack Live</a>. And now he's back as our 2022 Keynote Speaker... please welcome, Joe Grand!</p> */}
                  <p className='tab-paragraph'>Phillip Wylie is an offensive security professional with over 22 years of cybersecurity experience. He is a former Dallas College Adjunct Instructor, where he taught pentesting and web app pentesting. Phillip&apos;s diverse background includes network and application security, as well as pentesting. With over a decade of offensive security experience, he has conducted pentests of networks, Wi-Fi networks, and applications.  </p>
                  <p className='tab-paragraph'>Phillip&apos;s contributions to the cybersecurity industry extend beyond his work as a pentester. He is the concept creator and co-author of The Pentester Blueprint: Starting a Career as an Ethical Hacker, inspired by a lecture he presented to his class at Dallas College, which later became a conference talk. Phillip is a podcaster and hosts The Phillip Wylie Show, where he interviews cybersecurity professionals. Additionally, he is a frequent conference speaker, workshop instructor, and mentor.</p>
                   
                </div>
{/*
                <div className='keynote-talk'>
                  <div className='keynote-topic'>The State of Information Security Today</div>
                  <div className='keynote-abstract'>
                    <p className='tab-paragraph'>The intent of this talk is to take a macro level look at the state of the information security industry today based on my 40+ years' experience in the business - including nearly 30 years as a consultant to hundreds of commercial enterprises. I began my career at the National Security Agency and was a pioneer in penetration testing and vulnerability assessment methodologies for both DoD and Civil agencies. I begin with a review of where we stand today and discuss the key reasons why so many organizations are failing. I then offer the solution to what companies need to do if they truly want to be secure and how our industry can be part of the solution.</p>
                  </div>
                </div>
*/}
               </div>
               <div className='keynote-right'>
                <img src={Phillip}
                  alt='Phillip Wylie'
                  className='keynote-image'/>
               </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel tabId="speakers">
          <div className='text-area'>
            <h3 className='title'>Speakers</h3>
            <Speakers />
          </div>
        </TabPanel>

        <TabPanel tabId="talks">
          <div className='text-area'>
            <h3 className='title'>Talks</h3>
            <Talks />
          </div>
        </TabPanel>

        <TabPanel tabId="villages">
          <div className='text-area'>
            
            <CallOuts title='Villages' config={villageConfig as unknown as CallOutsConfig} />

          </div>
        </TabPanel>

        <TabPanel tabId="competitions">
          <div className='text-area'>
            <CallOuts title='Competitions' config={competitionConfig as unknown as CallOutsConfig} />
          </div>
        </TabPanel>

        <TabPanel tabId="entertainment">
          <div className='text-area'>
            <CallOuts title='Entertainment' config={entertainmentConfig as unknown as CallOutsConfig} />
          </div>
        </TabPanel>

        <TabPanel tabId="careers">
          <div className='text-area'>
            <CallOuts title='Careers' config={careersConfig as unknown as CallOutsConfig} />
          </div>
        </TabPanel>
      </Tabs>
    );
  }

  render() {
    return (
      <div className='container'>
      <div className="venue-section">
			<div className="con-page">
				<div className="text-area">
          <h3 className='title'>Agenda</h3>
            <MediaQuery minWidth={1000}>
              {this.getTabs(true)}
            </MediaQuery>
            <MediaQuery maxWidth={999}>
              {this.getTabs(false)}
            </MediaQuery>
        </div>
        </div>
        </div>
      </div>
    );
  }
}
