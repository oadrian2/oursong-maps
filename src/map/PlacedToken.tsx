import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Placement, TokenID } from '../api/types';
import { cellSizeState, hasFacingState } from '../app/campaignState';
import { trackedPositionState } from '../app/mapState';
import {
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  edgeToEdgeCellDistance,
  roundToStep,
  tokenConnection
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

  const {
    position,
    facing,
    scale,
    visible,
    active,
    label,
    name,
    shape: { color, type },
  } = useRecoilValue(fullTokenState(id))!;

  // console.log('PlacedToken render');

  const selfPlacement = { position: position!, facing, scale };

  const overlay =
    !!activeId &&
    trackedPlacement &&
    position?.x !== trackedPlacement.position.x &&
    position?.y !== trackedPlacement.position.y &&
    distance(trackedPlacement, selfPlacement, measurementStrategy[MeasurementStrategy.centerToCenterNormalized], cellSize) +
      orientation(trackedPlacement, selfPlacement, hasFacing);

  const handleMouseEnter = useCallback(() => {
    setActiveId(id);
    setTrackedPlacement(position && { position, facing, scale });
  }, [id, setActiveId, position, facing, scale, setTrackedPlacement]);

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
      {type === 'marker' && <MarkerToken name={name} color={color} effectRadius={2} />}
      {type === 'figure' && (
        <ScalingBox scale={scale}>
          <FigureBase title={name}>
            <BorderLayer color={color} />
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

export const ContentLayer = styled.div`
  position: absolute;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  background: transparent;
  color: white;
`;

type PlacedTokenProps = { id: TokenID; isSelected?: boolean; onClick?: React.EventHandler<React.SyntheticEvent> };

// export function StorageFigureToken({ name, color, active, selected, scale, position }) {}

// export function PlacedFigureToken({ name, color, active, selected, scale, position, facing, label }: PlacedFigureTokenProps) {
//   return (
//     <>
//       <TokenSelectionRing selected={selected} />
//       <FigureToken name={name} color={color} label={label} />
//       {!active && <DeathMarker />}
//       {typeof facing === 'number' && <TokenFacing facing={facing} />}
//     </>
//   );
// }

// export type PlacedFigureTokenProps = { name: string };

// export function PlacedMarkerToken({ name }: PlacedMarkerTokenProps) {}

// export type PlacedMarkerTokenProps = { name: string };

// type Sizeable = { scale: number };
// type Selectable = { selected: boolean };
// type Placeable = { position: Point | null };
// type Faceable = { facing: Angle | null };

// type Marker = Sizeable & Placeable & Faceable;

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

export const TokenSelectionRing = styled.div(({ selected }: TokenSelectionRingProps) => ({
  position: 'absolute',
  inset: -4,
  borderWidth: 4,
  borderStyle: 'solid',
  borderColor: 'lightgreen',
  borderRadius: '50%',
  transition: 'opacity 0.2s ease-in-out',
  opacity: selected ? 1.0 : 0.0,
  pointerEvents: 'none',
}));

TokenSelectionRing.displayName = 'TokenSelectionRing';

export type TokenSelectionRingProps = { selected: boolean };
