import { Component, type MouseEvent } from 'react';
import './Button.scss';

interface ButtonProps {
  title?: string;
  href?: string;
  class?: string;
  onClick?: (evt: MouseEvent<HTMLAnchorElement>) => void;
}

class Button extends Component<ButtonProps> {
  static displayName = 'Button';

  static defaultProps: Partial<ButtonProps> = {
    class: '',
    onClick: function onClick() {}
  };

  constructor(props: ButtonProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <a onClick={this.handleClick}
        rel="noopener noreferrer"
        href={this.props.href}
        className={`btn btn-sm animated-button victoria-four ${this.props.class}`}>
        {this.props.title}
      </a>
    );
  }

  handleClick(evt: MouseEvent<HTMLAnchorElement>) {
    this.props.onClick?.(evt);
  }
}

export default Button;
