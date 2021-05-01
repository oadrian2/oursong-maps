import { Figures } from './Figures';
import { Markers } from './Markers';
import { Stash } from './Stash';
import './Supply.css';

export function Supply() {
  return (
    <div className="supply">
      <div className="supply-fluid-container">
        <Figures />
      </div>
      <hr className="supply-rule" />
      <div className="supply-fixed-container">
        <Markers />
      </div>
      <hr className="supply-rule" />
      <div className="supply-fluid-container">
        <Stash />
      </div>
    </div>
  );
}
