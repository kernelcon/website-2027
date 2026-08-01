import { Component, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import './Modal.scss';

interface ModalProps {
  onClose: (evt: MouseEvent<HTMLButtonElement>) => void;
  show?: boolean;
  children?: ReactNode;
  title?: string;
  modalContentStyle?: CSSProperties;
  height?: string;
  width?: string;
  class?: string;
}

class Modal extends Component<ModalProps> {
  static displayName = 'Modal';

  static defaultProps: Partial<ModalProps> = {
    modalContentStyle: {
      padding: '20px'
    },
    class: ''
  };

  render() {
    if(!this.props.show) {
      return null;
    }

    return (
      <div className='backdrop'>
        <div className={`modal-container ${this.props.class}`}>
          <div className='modal-header'>
            <div className='modal-title'>
              {this.props.title}
            </div>
            <div className='modal-close'>
              <button className='close-btn' onClick={this.props.onClose}>&times;</button>
            </div>
          </div>
          <div className='modal-content' style={this.props.modalContentStyle}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
