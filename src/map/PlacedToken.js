/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { degToRad, offsetAngle } from '../app/math';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { MeasurementStrategy } from '../ruler/movementSlice';
import { selectGeneratorById } from '../supply/generatorsSlice';
import {
  CELL_DIAMETER,
  CELL_RADIUS,
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  edgeToEdgeCellDistance,
  tokenConnection
} from './metrics';
import { selectFocusedTokenId, tokenBlurred, tokenHovered } from './selectionSlice';
import { selectIndexWithinGroup, selectTokenById } from './tokenSlice';

export function PlacedToken({ id, onClick }) { 
  const dispatch = useDispatch();

  const activeId = useSelector(selectFocusedTokenId);

  const { position: selfPosition, angle: selfFacing, generator } = useSelector((state) => selectTokenById(state, id));
  const { shapeType, shape: selfShape } = useSelector((state) => selectGeneratorById(state, generator));

  const { position: activePosition, angle: activeFacing, generator: activeGenerator } =
    useSelector((state) => selectTokenById(state, activeId)) || {};
  const { shape: activeShape } = useSelector((state) => selectGeneratorById(state, activeGenerator)) || {};

  const index = useSelector((state) => selectIndexWithinGroup(state, { id, generator: generator }));

  // const { position: selfPosition, shapeType, shape: selfShape, index } = useSelector((state) => selectTokenShapeById(state, id));
  // const { position: activePosition, shape: activeShape } = useSelector((state) => selectTokenShapeById(state, activeId)) || {};

  const selfScale = (selfShape.baseSize ?? 30) / 30;
  const activeScale = (activeShape?.baseSize ?? 30) / 30;

  const overlay =
    !!activeId &&
    activeId !== id &&
    activePosition &&
    selfPosition &&
    overlayText(
      { position: activePosition, facing: activeFacing, scale: activeScale },
      { position: selfPosition, facing: selfFacing, scale: selfScale },
      measurementStrategy[MeasurementStrategy.centerToCenterNormalized]
    );

  const onMouseEnter = useCallback(() => dispatch(tokenHovered(id)), [dispatch, id]);
  const onMouseLeave = useCallback(() => dispatch(tokenBlurred(id)), [dispatch, id]);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ transform: `scale(${selfScale})` }} onClick={onClick}>
      {shapeType === 'marker' && <MarkerToken index={index} {...selfShape} effectRadius={2} />}
      {shapeType === 'figure' && <FigureToken index={index} {...selfShape} overlay={overlay} />}
      {shapeType === 'figure' && <TokenFacing facing={selfFacing} />}
    </div>
  );
}

export function TokenFacing({ facing }) {
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

function overlayText(origin, target, strategy) {
  const { position: originPosition, facing: originFacing, scale: originScale } = origin;
  const { position: targetPosition, facing: targetFacing, scale: targetScale } = target;

  const [isOriginFacingTarget, isTargetFacingOrigin] = tokenConnection(originPosition, originFacing, targetPosition, targetFacing);

  const range = strategy(originPosition, targetPosition, targetScale, originScale);

  return range.toFixed(1) + (!isOriginFacingTarget ? 'X' : isTargetFacingOrigin ? 'F' : 'B');
}

const measurementStrategy = {
  [MeasurementStrategy.centerToCenter]: centerToCenterCellDistance,
  [MeasurementStrategy.edgeToEdge]: edgeToEdgeCellDistance,
  [MeasurementStrategy.centerToCenterNormalized]: centerToCenterNormalizedCellDistance,
};
