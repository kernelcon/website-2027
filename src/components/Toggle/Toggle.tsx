import type { ChangeEvent } from 'react';
import './Toggle.scss';

interface ToggleProps {
  checked?: boolean;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
}

const Toggle = ({ checked, onChange }: ToggleProps) => (
  <span className="toggle-control">
    <input
      className="dmcheck"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      id="dmcheck"
    />
    <label htmlFor="dmcheck" />
  </span>
);

export default Toggle;
