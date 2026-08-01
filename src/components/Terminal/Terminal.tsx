//credit - https://codepen.io/luxonauta/pen/PoNOoqB

import { Component } from 'react';
// import TextTerminal, { TerminalTexts } from '@twistezo/react-text-Terminal'
// import './Terminal.scss';
import './Terminal.scss';

class Terminal extends Component {
  static displayName = 'Terminal';

  render() {
    return (
        <main>
        <section className="hero has-dflex-center">
            <div className="lx-container-60">
            <div className="lx-row">
                <div className="box-border">
                <div className="overlay"></div>
                <div className="box">
                    <div className="code">
                        <p>WELCOME TO KERNELGPT</p>
                        <p>&gt;&nbsp;What is this year's Kernelcon theme?</p>
                        <br />
                        <p>Step into a world where A.I. sparks a symphony of Astonishing Ideas!</p>
                        <br />
                        <p>From Actual to Artificial Intelligence, we're on a mission to Achieve Impeccable hackery. Join us for an electrifying exploration of Amplified Ingenuity at Another Iteration of Kernelcon.
In this dynamic dance of Actual and Artificial Intelligence, we balance the Art of Innovation with Astute Insights. Amidst the Advancements, we're not blind to the potential Adversities. Yet, with our sights set on Automated Immunity, we'll ascend to new heights of digital defense.</p>
                        <br />
                        <p>Embrace the Age of A.I. - Actual Intelligence, Artificial Intelligence, and everything In-between!</p>
                        <br />
                    {/* <p>&gt;&nbsp;What are the Three Laws of Robotics?</p>
                    <p>&gt;&nbsp;SEARCHING THE DATABASE</p>
                    <p>&gt;&nbsp;1: A ROBOT MAY NOT INJURE A HUMAN BEING OR, THROUGH INACTION, ALLOW A HUMAN
                        BEING TO COME TO HARM;</p>
                    <p>&gt;&nbsp;2: A ROBOT MUST OBEY THE ORDERS GIVEN IT BY HUMAN BEINGS EXCEPT WHERE SUCH
                        ORDERS WOULD CONFLICT WITH THE FIRST LAW;</p>
                    <p>&gt;&nbsp;2: A ROBOT MUST OBEY THE ORDERS GIVEN IT BY HUMAN BEINGS EXCEPT WHERE SUCH
                        ORDERS WOULD CONFLICT WITH THE FIRST LAW;</p>
                    <p>&gt;&nbsp;3: A ROBOT MUST PROTECT ITS OWN EXISTENCE AS LONG AS SUCH PROTECTION DOES
                        NOT CONFLICT WITH THE FIRST OR SECOND LAW;</p>
                    <p>&gt;&nbsp;THE ZEROTH LAW: A ROBOT MAY NOT HARM HUMANITY, OR, BY INACTION, ALLOW
                        HUMANITY TO COME TO HARM.”</p> */}
                    <p className="cursor-blink">&gt;&nbsp;<b>|</b></p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
        </main>
    );
  }
}



export default Terminal;
