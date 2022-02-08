import styled from '@emotion/styled';
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
          <React.Suspense fallback={<StashLabel />}>
            <Stash />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}

export const TokenContainerLabel = styled.div`
  writing-mode: vertical-lr;
  text-orientation: upright;
  color: white;
  font-size: 2rem;
  text-transform: uppercase;
  text-align: center;
  flex: 1 1 auto;
  user-select: none;
`;

export const ModelsLabel = () => <TokenContainerLabel>Models</TokenContainerLabel>;

export const StashLabel = () => <TokenContainerLabel>Stash</TokenContainerLabel>;
