import { Component, type Key } from "react";
import Collapse from "rc-collapse";
import { faqConfig } from "../../content";
import "./About.scss";
import "rc-collapse/assets/index.css";

const Panel = Collapse.Panel;

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQState {
  accordion: boolean;
  activeKey: string[];
}

class FAQ extends Component<object, FAQState> {
  static displayName = "FAQ";

  constructor(props: object) {
    super(props);
    this.state = {
      accordion: false,
      activeKey: ["0"],
    };
  }

  onChange = (activeKey: Key | Key[]) => {
    const keys = Array.isArray(activeKey) ? activeKey : [activeKey];
    this.setState({
      activeKey: keys.map(String),
    });
  };

  render() {
    const { accordion, activeKey } = this.state;

    const faq = (faqConfig as FaqItem[]).map((ele, idx) => {
      const question = (
        <div className="faq-question">
          <span className="faq-q">Q</span>
          <span className="question">{ele.question}</span>
        </div>
      );

      const answer = (
        <div className="faq-answer">
          <span className="faq-a">A</span>
          <span className="answer" dangerouslySetInnerHTML={{ __html: ele.answer }} />
        </div>
      );

      return (
        <Collapse
          className="faq-single"
          onChange={this.onChange}
          accordion={accordion}
          activeKey={activeKey}
          key={idx}
        >
          <Panel header={question} key={String(idx)}>
            {answer}
          </Panel>
        </Collapse>
      );
    });

    return <div className="faq-list">{faq}</div>;
  }
}

export default FAQ;
