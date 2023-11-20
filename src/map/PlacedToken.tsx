import { styled } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Placement, TokenID } from '../api/types';
import { cellSizeState, hasFacingState } from '../app/campaignState';
import { trackedPositionState } from '../app/mapState';
import {
  arePointsSame,
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  edgeToEdgeCellDistance,
  roundToMultiple,
  tokenConnection,
} from '../app/math';
import { MeasurementStrategy } from '../app/state';
import { fullTokenState } from '../app/tokenState';
import { BorderLayer, DeathMarker, FigureBase, MarkerToken, Overlay, ScaledBox } from '../doodads';
import { TokenFacing } from './TokenFacing';

export function PlacedToken({ id, isSelected = false, onClick = () => {} }: PlacedTokenProps) {
  const { amount: cellSize } = useRecoilValue(cellSizeState);
  const hasFacing = useRecoilValue(hasFacingState);

  const [trackedPlacement, setTrackedPlacement] = useRecoilState(trackedPositionState);

  const { position, facing, scale, visible, active, label, name, shape } = useRecoilValue(fullTokenState(id))!;

  // Position being null can happen when this refreshes before the container page removes the entry
  // Likely we need to handle position separately from the rest of the properties
  const selfPlacement = useMemo(() => ({ position: position!, facing, scale }), [position, facing, scale]);

  const showOverlay = !!trackedPlacement && !arePointsSame(trackedPlacement.position, selfPlacement.position);

  const overlay =
    showOverlay &&
    distance(trackedPlacement, selfPlacement, measurementStrategy, cellSize) +
      (hasFacing ? orientation(trackedPlacement, selfPlacement) : '');

  const handleMouseEnter = useCallback(() => setTrackedPlacement(selfPlacement), [selfPlacement, setTrackedPlacement]);
  const handleMouseLeave = useCallback(() => setTrackedPlacement(null), [setTrackedPlacement]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: visible ? 1 : 0.5, transition: 'opacity 0.3s' }}
      onClick={onClick}
    >
      {shape.type === 'marker' && <MarkerToken name={name} color={shape.color} effectRadius={shape.auraSize} />}
      {shape.type === 'figure' && (
        <ScaledBox scale={scale}>
          <FigureBase title={name}>
            <BorderLayer color={shape.color} />
            <ContentLayer>{label}</ContentLayer>
            {!active && <DeathMarker />}
            {typeof overlay === 'string' && <Overlay>{overlay}</Overlay>}
            {typeof facing === 'number' && <TokenFacing facing={facing} />}
            <TokenSelectionRing selected={isSelected} />
          </FigureBase>
        </ScaledBox>
      )}
    </div>
  );
}

export const ContentLayer = styled('div')`
  position: absolute;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  background: transparent;
  color: white;
`;

type PlacedTokenProps = { id: TokenID; isSelected?: boolean; onClick?: React.EventHandler<React.SyntheticEvent> };

function distance(
  origin: Placement,
  target: Placement,
  mesasure: (origin: Placement, target: Placement) => number,
  multiplier: number
): number {
  return roundToMultiple(multiplier * mesasure(origin, target)!, multiplier / 10);
}

function orientation(origin: Placement, target: Placement): string {
  const [isOriginFacingTarget, isTargetFacingOrigin] = tokenConnection(origin, target);

  return !isOriginFacingTarget ? '' : isTargetFacingOrigin ? 'F' : 'B';
}

/**
 * A map of supported measurement strategies.
 */
const measurementStrategies = {
  [MeasurementStrategy.centerToCenter]: centerToCenterCellDistance,
  [MeasurementStrategy.edgeToEdge]: edgeToEdgeCellDistance,
  [MeasurementStrategy.centerToCenterNormalized]: centerToCenterNormalizedCellDistance,
};

/**
 * The current measurement strategy. Currently defaulted to center-to-center normalized as it's the only one that's been used.
 */
const measurementStrategy = measurementStrategies[MeasurementStrategy.centerToCenterNormalized];

/**
 * Selection ring for placed tokens.
 */
export const TokenSelectionRing = styled('div')<TokenSelectionRingProps>`
  position: absolute;
  inset: -4px;
  border: 4px solid lightgreen;
  border-radius: 50%;
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ selected }) => (selected ? 1.0 : 0.0)};
  pointer-events: none;
`;

TokenSelectionRing.displayName = 'TokenSelectionRing';

export type TokenSelectionRingProps = { selected: boolean };
