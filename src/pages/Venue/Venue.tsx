import { Component } from "react";
import type { LegacyRouteProps } from "../../router-compat";
import FsLightbox from "fslightbox-react";
import { Tabs, Tab, TabPanel, TabList } from "../../components/ui/Tabs";
import MediaQuery from "react-responsive";
import "./Venue.scss";
import Hilton1 from "./kernelcon_hilton10.jpg";
import Hilton2 from "./kernelcon_hilton2.jpg";
// import Hilton3 from "./kernelcon_hilton3.jpg";
import Hilton4 from "./kernelcon_hilton4.jpg";
import Hilton5 from "./kernelcon_hilton5.jpg";
import Hilton6 from "./kernelcon_hilton6.jpg";
import Hilton7 from "./kernelcon_hilton7.jpg";
import Hilton8 from "./kernelcon_hilton8.jpg";
import Hilton9 from "./kernelcon_hilton9.jpg";
import Hilton10 from "./kernelcon_hilton1.jpg";

interface VenueState {
	defaultTab: string;
	toggler?: boolean;
}

export default class Venue extends Component<LegacyRouteProps, VenueState> {
	static displayName = "Venue";

	constructor(props: LegacyRouteProps) {
	  super(props);
	  this.state = {
		defaultTab: 'hotel' // default tab if none specified
	  }
	}
  
	componentDidMount() {
	  const { tabId } = this.props.match.params;
	  if (tabId) {
		this.setState({ defaultTab: tabId });
	  }
	}
  
	componentDidUpdate(prevProps: LegacyRouteProps) {
	  if (this.props.match.params.tabId !== prevProps.match.params.tabId) {
		const { tabId } = this.props.match.params;
		this.setState({ defaultTab: tabId || 'hotel' });
	  }
	}
  
	changeTab(tabId: string) {
	  this.props.history.push(`/venue/${tabId}`);
	}

	getTabs(vert: boolean) {
		return (
			<Tabs 
				defaultTab={this.state.defaultTab}
				onChange={(tabId) => this.changeTab(tabId)}
				vertical={vert}
			>
				<TabList>
					<Tab tabFor="hotel">Hotel</Tab>
					<Tab tabFor="omaha">Omaha</Tab>
					<Tab tabFor="parking">Parking</Tab>
				</TabList>
				<TabPanel tabId="hotel">
					<div className="text-area">
						{/* <div className="tab-title">Book Now</div> */}
							<div className="tab-title">Room Block</div>
						<div className="venue-hotel">
							<div className="venue-text">
								Book directly with the hotel {" "}
								<a
									className="text-highlight"
									href="https://book.passkey.com/event/51054175/owner/22518/landing"
									rel="noopener noreferrer"
									target="_blank">
									here
								</a>
								{" "} simply choose "Attendee" type we don't use the "access code" feature. Staying at the conference hotel is convenient and helps Kernelcon a lot. The more attendees staying at the hotel, the more conference space we can retain and activities we can support. 
	                            The 2027 rate is $205/night. If you run into any issues, please contact us or the hotel directly.  The issues are often easy for the hotel to identify and remedy.
							</div>
							<div className="venue-text">
								{/* Please book by March <s>11</s> 18th (extended!) for our group rate. */}
							</div>
							{/* <div className="venue-text">
								We will have a block of rooms available again this year for those wanting to stay on site.  Check back soon!
							</div> */}
						</div>					
						<div className="tab-title">Hotel</div>
						<div className="venue-hotel">
							<div className="text-area">
								We continue 2027 at our upgraded, bigger venue! This hotel has several advantages including co-locating the bar with the party, check out the pictures, click to view more!
								<div className="new-hotel-section"
									onClick={() => this.setState((prevState) => ({ 
									toggler: !prevState.toggler
									}))}>
									<img className="new-hotel-pic" src={Hilton1} alt="hilton1" />
									<img className="new-hotel-pic" src={Hilton2} alt="hilton2" />
									<img className="new-hotel-pic" src={Hilton4} alt="hilton4" />
									<img className="new-hotel-pic" src={Hilton5} alt="hilton5" />
									<img className="new-hotel-pic" src={Hilton6} alt="hilton6" />
									<img className="new-hotel-pic" src={Hilton7} alt="hilton7" />
									<img className="new-hotel-pic" src={Hilton8} alt="hilton8" />
									<img className="new-hotel-pic" src={Hilton9} alt="hilton9" />
									<img className="new-hotel-pic" src={Hilton10} alt="hilton10" />
								</div>
								<FsLightbox
									toggler={this.state.toggler}
									sources={[
										Hilton1, Hilton2, Hilton4, Hilton5, Hilton6, Hilton7, Hilton8, Hilton9, Hilton10
									]}
								/>
							</div>
						</div>
					</div>
					<div className="text-area">
						<div className="tab-title">
							Hotel & Location Information
						</div>
						<div className="venue-hotel">
							<div className="venue-location">
								<div className="venue-hotel-book">
									<div className="venue-hotel-info">
										<div className="venue-text">
											Hilton Omaha
											Downtown Old Market
										</div>
										<div className="hotel-sub-text">
											1001 Cass St
											Omaha, NE 68102
										</div>
										<div className="hotel-sub-text">
											TEL: +1-402-998-3400
										</div>
									</div>
								</div>
								<div className="map-container">
									<MediaQuery minWidth={1000}>
										<iframe
											title="hotel-map"
											id="hotelMap"
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.1025272247825!2d-95.93039910000002!3d41.2631035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87938fba1e715c55%3A0x1a0ff3cbee3a661b!2sHilton%20Omaha!5e0!3m2!1sen!2sus!4v1722300996164!5m2!1sen!2sus"
											width="800" 
											height="600" 
											allowFullScreen 
											loading="lazy" 
											referrerPolicy="no-referrer-when-downgrade"
											style={{ marginTop: "-150px" }}>
											Loading...
										</iframe>
									</MediaQuery>
									<MediaQuery maxWidth={999}>
									<iframe
											title="hotel-map"
											id="hotelMap"
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.1025272247825!2d-95.93039910000002!3d41.2631035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87938fba1e715c55%3A0x1a0ff3cbee3a661b!2sHilton%20Omaha!5e0!3m2!1sen!2sus!4v1722300996164!5m2!1sen!2sus"
											width="400" 
											height="400" 
											allowFullScreen 
											loading="lazy" 
											referrerPolicy="no-referrer-when-downgrade"
											style={{ marginTop: "-150px" }}>
											Loading...
										</iframe>
									</MediaQuery>
								</div>
							</div>
						</div>
					</div>
				</TabPanel>

				<TabPanel tabId="omaha">
					<div className="tab-title">Why Omaha?</div>
					<p className="about-sub-text">
						Kernelcon was founded with one goal in mind:
					</p>
					<p className="venue-hightlight-text">
						{" "}
						<b>To be the midwest's premier information security
						conference.</b>
					</p>
					<p className="about-sub-text">
						Therefore, the event needs to be centrally located, with
						a large local infosec community. Omaha has three
						universities certified as Centers of Academic Excellence
						through the NSA, multiple local cyber security groups
						such as{" "}
						<a
							className="text-highlight"
							href="http://dc402.org"
							rel="noopener noreferrer"
							target="_blank">
							DEF CON 402
						</a>
						,{" "}
						<a
							className="text-highlight"
							href="https://www.nebraskacert.org/"
							rel="noopener noreferrer"
							target="_blank">
							NebraskaCERT
						</a>
						, and{" "}
						<a
							className="text-highlight"
							href="https://www.unomaha.edu/college-of-information-science-and-technology/school-of-interdisciplinary-informatics/student-involvement/index.php"
							rel="noopener noreferrer"
							target="_blank">
							NULLify
						</a>
						, and plenty of opportunities in the information
						security field.
					</p>
					<p className="about-sub-text">
						Kernelcon will be held in the heart of Omaha’s historic
						Old Market, alongside the Missouri River. The Old Market
						is the hub of Omaha’s nightlife, with excellent bars,
						breweries, restaurants and shops all around.
					</p>
					<p className="about-sub-text">
						Our venue, the Hilton Omaha, is a quick
						drive/shuttle ride from Omaha Eppley Airfield. Omaha is
						less than a day’s drive from many large cities in the
						Midwest and is an easy flight from both coasts. Pack
						your bags and plan for a trip where the people are
						friendly, the steaks are fresh, and hacking goes all
						night.
					</p>
				</TabPanel>
				<TabPanel tabId="parking">
					<div className="tab-title">Where to Park</div>
					<p className="about-sub-text"><b>For hotel guests:</b></p>
					<p className="about-sub-text">
						Hotel garage parking is an additional charge for hotel guests. It is not included with the conference room rate.
					</p>
					<p className="about-sub-text"><b>For commuters:</b></p>
					<p className="about-sub-text">
						We're happy to say that the conference parking is
						readily available. There is metered parking all along 10th street
						and several lots in the vicinity with affordable daily rates.{" "}
						<a
							className="text-highlight"
							href="https://www.parkomaha.com/map/"
							rel="noopener noreferrer"
							target="_blank">
							Park Omaha
						</a>{" "} is a fantastic resource.
					</p>
					{/* <p className="about-sub-text">
						<b>More information coming soon!</b>
					</p> */}
				</TabPanel>
			</Tabs>
		);
	}

	render() {
		return (
			<div id="main_hero" className="">
				<div className="container">
					<div className="venue-section">
						<div className="page-header">
							<span className="page-pre-label">Hilton Omaha · Old Market</span>
							<h1>The <span>Stage</span></h1>
							<div className="page-sub">Hilton Omaha · Old Market · March 4-5, 2027</div>
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
		);
	}
}
