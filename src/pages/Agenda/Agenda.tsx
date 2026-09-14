import { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from '../../components/ui/Tabs';
import MediaQuery from 'react-responsive';
import TalksSchedule from './TalksSchedule/TalksSchedule';
// import CallOuts from '../../components/CallOuts/CallOuts';
// import type { ComponentProps } from 'react';
// import { villageConfig, competitionConfig } from '../../content';
import './Agenda.scss';
import type { LegacyRouteProps } from '../../router-compat';

// Commented out until content is ready:
// import Speakers from './Speakers/Speakers';
// import Talks from './Talks/Talks';
// import { entertainmentConfig, careersConfig } from '../../content';

type AgendaProps = LegacyRouteProps;

interface AgendaState {
  defaultTab: string;
}

export default class Agenda extends Component<AgendaProps, AgendaState> {
  static displayName = 'Agenda';

  constructor(props: AgendaProps) {
    super(props);
    this.state = {
      defaultTab: 'schedule'
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
      this.setState({ defaultTab: tabId || 'schedule' });
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
          {/* <Tab tabFor="keynotes">Keynotes</Tab> */}
          {/* <Tab tabFor="speakers">Speakers</Tab> */}
          {/* <Tab tabFor="talks">Talks</Tab> */}
          <Tab tabFor="villages">Villages</Tab>
          <Tab tabFor="competitions">Competitions</Tab>
          {/* <Tab tabFor="entertainment">Entertainment</Tab> */}
          {/* <Tab tabFor="careers">Careers</Tab> */}
        </TabList>

        <TabPanel tabId="schedule">
          <div className="text-area">
            <TalksSchedule />
          </div>
        </TabPanel>

        <TabPanel tabId="villages">
          <div className="text-area">
            {/* <CallOuts title="Villages" config={villageConfig as unknown as CallOutsConfig} /> */}
            <div className="coming-soon-block">
              <div className="coming-soon-title">Villages</div>
              <p className="coming-soon-text">
                Check back soon. Village details are being finalized and will be posted here as they're confirmed — we'll be adding them on a rolling basis throughout the lead-up to the con.
              </p>
            </div>
          </div>
        </TabPanel>

        <TabPanel tabId="competitions">
          <div className="text-area">
            {/* <CallOuts title="Competitions" config={competitionConfig as unknown as CallOutsConfig} /> */}
            <div className="coming-soon-block">
              <div className="coming-soon-title">Competitions</div>
              <p className="coming-soon-text">
                Check back soon. Competitions are being lined up and will appear here as they're locked in — expect this list to grow as we get closer to March.
              </p>
            </div>
          </div>
        </TabPanel>

        {/* keynotes, speakers, talks, entertainment, careers - coming soon */}
      </Tabs>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="venue-section">
          <div className="con-page">
            <div className="text-area">
              <div className="page-header">
                <span className="page-pre-label">Kernelcon 2027</span>
                <h1>The <span>Agenda</span></h1>
                <div className="page-sub">March 4-5, 2027 · Hilton Omaha</div>
                <div className="page-rule" />
              </div>
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
