import { styled } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Placement, TokenID } from '../api/types';
import { cellSizeState, hasFacingState } from '../app/campaignState';
import { trackedPositionState } from '../app/mapState';
import {
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  edgeToEdgeCellDistance,
  roundToStep,
  tokenConnection,
} from '../app/math';
import { MeasurementStrategy } from '../app/state';
import { fullTokenState, hoveredTokenIdState } from '../app/tokenState';
import { BorderLayer } from '../doodads/BorderLayer';
import { MarkerToken } from '../doodads/MarkerToken';
import { Overlay } from '../doodads/Overlay';
import { FigureBase } from '../doodads/TokenBase';
import { DeathMarker } from './DeathMarker';
import { ScalingBox } from './ScalingBox';
import { TokenFacing } from './TokenFacing';

export function PlacedToken({ id, isSelected = false, onClick = () => {} }: PlacedTokenProps) {
  const [activeId, setActiveId] = useRecoilState(hoveredTokenIdState);
  const { amount: cellSize } = useRecoilValue(cellSizeState);
  const hasFacing = useRecoilValue(hasFacingState);

  const [trackedPlacement, setTrackedPlacement] = useRecoilState(trackedPositionState);

  const { position, facing, scale, visible, active, label, name, shape } = useRecoilValue(fullTokenState(id))!;

  // Position being null can happen when this refreshes before the container page removes the entry
  // Likely we need to handle position separately from the rest of the properties
  const selfPlacement = useMemo(() => ({ position: position!, facing, scale }), [position, facing, scale]);

  const overlay =
    !!activeId &&
    trackedPlacement &&
    position?.x !== trackedPlacement.position.x &&
    position?.y !== trackedPlacement.position.y &&
    distance(trackedPlacement, selfPlacement, measurementStrategy[MeasurementStrategy.centerToCenterNormalized], cellSize) +
      orientation(trackedPlacement, selfPlacement, hasFacing);

  const handleMouseEnter = useCallback(() => {
    setActiveId(id);
    setTrackedPlacement(selfPlacement);
  }, [id, selfPlacement, setActiveId, setTrackedPlacement]);

  const handleMouseLeave = useCallback(() => {
    setActiveId(null);
    setTrackedPlacement(null);
  }, [setActiveId, setTrackedPlacement]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: visible ? 1 : 0.5, transition: 'opacity 0.3s' }}
      onClick={onClick}
    >
      {shape.type === 'marker' && <MarkerToken name={name} color={shape.color} effectRadius={shape.auraSize} />}
      {shape.type === 'figure' && (
        <ScalingBox scale={scale}>
          <FigureBase title={name}>
            <BorderLayer color={shape.color} />
            <ContentLayer>{label}</ContentLayer>
            {!active && <DeathMarker />}
            {typeof overlay === 'string' && <Overlay>{overlay}</Overlay>}
            {typeof facing === 'number' && <TokenFacing facing={facing} />}
            <TokenSelectionRing selected={isSelected} />
          </FigureBase>
        </ScalingBox>
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
  strategy: (origin: Placement, target: Placement) => number,
  multiplier: number
): number {
  return roundToStep(multiplier * strategy(origin, target)!, multiplier / 10);
}

function orientation(origin: Placement, target: Placement, hasFacing: boolean): string {
  if (!hasFacing) return '';

  const [isOriginFacingTarget, isTargetFacingOrigin] = tokenConnection(origin, target);

  return !isOriginFacingTarget ? 'X' : isTargetFacingOrigin ? 'F' : 'B';
}

const measurementStrategy = {
  [MeasurementStrategy.centerToCenter]: centerToCenterCellDistance,
  [MeasurementStrategy.edgeToEdge]: edgeToEdgeCellDistance,
  [MeasurementStrategy.centerToCenterNormalized]: centerToCenterNormalizedCellDistance,
};

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
