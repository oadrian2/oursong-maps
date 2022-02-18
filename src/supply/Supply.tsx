import { styled } from '@mui/material';
import React from 'react';
import { Figures } from './Figures';
import { Markers } from './Markers';
import { Stash } from './Stash';

export function Supply() {
  return (
    <SupplyPanel>
      <SupplyFluidContainer>
        <TokenContainer kind="figure">
          <Figures />
        </TokenContainer>
      </SupplyFluidContainer>

      <SupplyRule />

      <SupplyFixedContainer>
        <TokenContainer kind="marker">
          <Markers />
        </TokenContainer>
      </SupplyFixedContainer>

      <SupplyRule />

      <SupplyFluidContainer>
        <TokenContainer kind="figure">
          <React.Suspense fallback={<StashLabel />}>
            <Stash />
          </React.Suspense>
        </TokenContainer>
      </SupplyFluidContainer>
    </SupplyPanel>
  );
}

export const ModelsLabel = () => <TokenContainerLabel>Models</TokenContainerLabel>;

export const StashLabel = () => <TokenContainerLabel>Stash</TokenContainerLabel>;

const SupplyPanel = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.2rem;
`;

const SupplyRule = styled('hr')`
  flex: none;
  border: 0.125rem solid;
  border-style: none none solid;
  width: 100%;
`;

const SupplyFluidContainer = styled('div')`
  flex: 1 1 var(--tokenSize);
  min-height: var(--tokenSize) * 4;
  overflow-y: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
  }
`;

const SupplyFixedContainer = styled('div')`
  flex: none;
`;

const TokenContainer = styled('div')<{ kind: 'figure' | 'marker' }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 0.25rem;
  min-width: 100%;
  min-height: 100%;

  ${({ kind }) => (kind === 'marker' ? 'transform: translateY(16px)' : '')}
`;

const TokenContainerLabel = styled('div')`
  writing-mode: vertical-lr;
  text-orientation: upright;
  color: white;
  font-size: 2rem;
  text-transform: uppercase;
  text-align: center;
  flex: 1 1 auto;
  user-select: none;
`;
