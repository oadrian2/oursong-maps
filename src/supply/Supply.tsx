import React from 'react';
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
        <div className="token-container">
          <React.Suspense fallback={<div className="token-container-empty-label">Stash</div>}>
            <Stash />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
