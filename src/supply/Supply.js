import { Figures } from './Figures';
import { Markers } from './Markers';
import { Stash } from './Stash';
import './Supply.css';
import { Trash } from './Trash';

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
      <hr className="supply-rule" />
      <div className="supply-fixed-container">
        <Trash />
      </div>
    </div>
  );
}
