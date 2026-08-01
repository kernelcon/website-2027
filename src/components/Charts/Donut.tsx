import { Component } from 'react';
import './Donut.scss';

interface DonutProps {
  value?: number;
  valueLabel?: string;
  size?: number;
  stroke?: number;
  showText?: boolean;
  color?: string;
}

class Donut extends Component<DonutProps> {
  static displayName = 'Donut';

  static defaultProps: Partial<DonutProps> = {
    value: 0,
    valueLabel: 'Technical',
    size: 25,
    stroke: 5,
    showText: false,
    color: '#ad974f'
  };

  render() {
    const size = this.props.size ?? 25;
    const stroke = this.props.stroke ?? 5;
    const value = this.props.value ?? 0;

    const halfsize = (size * 0.5);
    const radius = halfsize - (stroke * 0.5);
    const circumference = 2 * Math.PI * radius;
    const strokeval = ((value * circumference) / 100);
    const dashval = (strokeval + ' ' + circumference);

    const trackstyle = {strokeWidth: stroke};
    const indicatorstyle = {strokeWidth: stroke, strokeDasharray: dashval};
    const rotateval = 'rotate(-90 '+halfsize+','+halfsize+')';

    return (
      <svg width={size} height={size} className="donutchart">
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track"/>
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={indicatorstyle} className="donutchart-indicator"/>
        {this.props.showText && <text className="donutchart-text" x={halfsize} y={halfsize} style={{textAnchor:'middle'}} >
          <tspan className="donutchart-text-val">{this.props.value}</tspan>
          <tspan className="donutchart-text-percent">%</tspan>
          <tspan className="donutchart-text-label" x={halfsize} y={halfsize+10}>{this.props.valueLabel}</tspan>
        </text>}
      </svg>
    );
  }
}

export default Donut;
