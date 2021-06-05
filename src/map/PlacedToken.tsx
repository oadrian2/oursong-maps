import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CELL_DIAMETER,
  CELL_RADIUS,
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  degToRad,
  edgeToEdgeCellDistance,
  Facing,
  offsetAngle,
  Placement,
  tokenConnection,
} from '../app/math';
import { RootState } from '../app/store';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { MeasurementStrategy } from '../ruler/movementSlice';
import { selectGeneratorById } from '../supply/generatorsSlice';
import { selectFocusedTokenId, tokenBlurred, tokenHovered } from './selectionSlice';
import { selectIndexWithinGroup, selectTokenById, TokenID } from './tokenSlice';

export function PlacedToken({ id, onClick = () => {} }: PlacedTokenProps) {
  const dispatch = useDispatch();

  const activeId = useSelector(selectFocusedTokenId);

  const {
    position: selfPosition,
    facing: selfFacing,
    generator,
    visible = true,
  } = useSelector((state: RootState) => selectTokenById(state, id)!);
  const { shapeType, shape: selfShape } = useSelector((state: RootState) => selectGeneratorById(state, generator)!);

  const {
    position: activePosition,
    facing: activeFacing,
    generator: activeGenerator,
  } = useSelector((state: RootState) => activeId && selectTokenById(state, activeId)) || {};
  const { shape: activeShape } = useSelector((state: RootState) => activeGenerator && selectGeneratorById(state, activeGenerator)) || {};

  const index = useSelector((state: RootState) => selectIndexWithinGroup(state, { id, generator }));

  const selfScale = (selfShape.baseSize ?? 30) / 30;
  const activeScale = (activeShape?.baseSize ?? 30) / 30;

  const overlay =
    !!activeId &&
    activeId !== id &&
    activePosition &&
    selfPosition &&
    overlayText(
      { position: activePosition!, facing: activeFacing!, scale: activeScale! },
      { position: selfPosition!, facing: selfFacing!, scale: selfScale! },
      measurementStrategy[MeasurementStrategy.centerToCenterNormalized]
    );

  const onMouseEnter = useCallback(() => dispatch(tokenHovered(id)), [dispatch, id]);
  const onMouseLeave = useCallback(() => dispatch(tokenBlurred(id)), [dispatch, id]);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transform: `scale(${selfScale})`, opacity: visible ? 1 : 0.5, transition: 'opacity 0.3s' }}
      onClick={onClick}
    >
      {shapeType === 'marker' && <MarkerToken {...selfShape} effectRadius={2} />}
      {shapeType === 'figure' && <FigureToken {...selfShape} index={index} overlay={overlay} />}
      {shapeType === 'figure' && selfFacing && <TokenFacing facing={selfFacing} />}
    </div>
  );
}

type PlacedTokenProps = { id: TokenID; onClick?: React.EventHandler<React.SyntheticEvent> };

export function TokenFacing({ facing }: TokenFacingProps) {
  const origin = { x: 0, y: 0 };
  const edge = { x: CELL_RADIUS - 2.0 /* border width */, y: 0 };
  const bot = offsetAngle(origin, edge, degToRad(-10));
  const top = offsetAngle(origin, edge, degToRad(+10));

  const tipX = CELL_RADIUS - 6.0; /* tip length */
  const tipY = origin.y;

  const facingPath = `M ${bot.x} ${bot.y} A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${top.x} ${top.y} L ${tipX} ${tipY}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`-${CELL_RADIUS} -${CELL_RADIUS} ${CELL_DIAMETER} ${CELL_DIAMETER}`}
      style={{ position: 'absolute', top: 0, transform: `rotate(${facing}rad)`, pointerEvents: 'none' }}
    >
      <path d={facingPath} fill="white" />
    </svg>
  );
}

type TokenFacingProps = { facing: Facing };

function overlayText(origin: Placement, target: Placement, strategy: (origin: Placement, target: Placement) => number) {
  const [isOriginFacingTarget, isTargetFacingOrigin] = tokenConnection(origin, target);

  const range = strategy(origin, target)!;

  return range.toFixed(1) + (!isOriginFacingTarget ? 'X' : isTargetFacingOrigin ? 'F' : 'B');
}

const measurementStrategy = {
  [MeasurementStrategy.centerToCenter]: centerToCenterCellDistance,
  [MeasurementStrategy.edgeToEdge]: edgeToEdgeCellDistance,
  [MeasurementStrategy.centerToCenterNormalized]: centerToCenterNormalizedCellDistance,
};
