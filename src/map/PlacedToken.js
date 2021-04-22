import ArchiveIcon from '@material-ui/icons/Archive';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import { AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { degToRad, offsetAngle } from '../app/math';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { MeasurementStrategy } from '../ruler/movementSlice';
import { selectGeneratorById } from '../supply/generatorsSlice';
import { ArcFab } from './ArcFab';
import { centerToCenterCellDistance, centerToCenterNormalizedCellDistance, connection, edgeToEdgeCellDistance } from './metrics';
import { selectFocusedTokenId, selectSelectedTokenId, tokenEntered, tokenLeft, tokenSelected } from './selectionSlice';
import { selectIndexWithinGroup, selectTokenById, stashTokenRequested, trashTokenRequested } from './tokenSlice';

export function PlacedToken({ id }) {
  const dispatch = useDispatch();

  const activeId = useSelector(selectFocusedTokenId);

  const { position: selfPosition, angle: selfFacing, generator } = useSelector((state) => selectTokenById(state, id));
  const { shapeType, shape: selfShape } = useSelector((state) => selectGeneratorById(state, generator));

  const { position: activePosition, angle: activeFacing, generator: activeGenerator } = useSelector((state) => selectTokenById(state, activeId)) || {};
  const { shape: activeShape } = useSelector((state) => selectGeneratorById(state, activeGenerator)) || {};

  const index = useSelector((state) => selectIndexWithinGroup(state, { id, generator: generator }));

  const selectedTokenId = useSelector(selectSelectedTokenId);

  // const { position: selfPosition, shapeType, shape: selfShape, index } = useSelector((state) => selectTokenShapeById(state, id));
  // const { position: activePosition, shape: activeShape } = useSelector((state) => selectTokenShapeById(state, activeId)) || {};

  const selfScale = (selfShape.baseSize ?? 30) / 30;
  const activeScale = (activeShape?.baseSize ?? 30) / 30;

  const showingActive = !!activeId;
  const isActive = id === activeId;

  const strategy = measurementStrategy[MeasurementStrategy.centerToCenterNormalized];

  const [sft, tfs] = (showingActive && !isActive && activePosition && selfPosition && connection(activePosition, activeFacing, selfPosition, selfFacing)) || [false, false];

  const overlay =
    showingActive &&
    !isActive &&
    activePosition &&
    selfPosition &&
    strategy(activePosition, selfPosition, activeScale, selfScale).toFixed(1) + ' ' + (!sft ? 'X' : tfs ? 'F' : 'B');

  const onMouseEnter = useCallback(() => dispatch(tokenEntered(id)), [dispatch, id]);
  const onMouseLeave = useCallback(() => dispatch(tokenLeft(id)), [dispatch, id]);

  const onKillClick = useCallback(() => console.log('kill'), []);
  const onStashClick = useCallback(() => dispatch(stashTokenRequested({ id })), [dispatch, id]);
  const onTrashClick = useCallback(() => dispatch(trashTokenRequested({ id })), [dispatch, id]);

  const onClick = useCallback(() => dispatch(tokenSelected(id)), [dispatch, id]);

  const killPosition = +0.25 * Math.PI;
  const stashPosition = 0;
  const trashPosition = -0.25 * Math.PI;

  const origin = { x: 24, y: 24 };
  const edge = { x: 46, y: 24 };
  const bot = offsetAngle(origin, edge, degToRad(-10));
  const top = offsetAngle(origin, edge, degToRad(+10));

  const facingPath = `M ${bot.x} ${bot.y} A 24 24 0 0 1 ${top.x} ${top.y} L ${40} ${origin.y}`;

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ transform: `scale(${selfScale})` }} onClick={onClick}>
      {shapeType === 'figure' && <FigureToken index={index} {...selfShape} overlay={overlay} />}
      {shapeType === 'marker' && <MarkerToken index={index} {...selfShape} effectRadius={2} />}
      {shapeType === 'figure' && (
        <svg style={{ position: 'absolute', top: 0, width: '100%', height: '100%', transform: `rotate(${selfFacing}rad)` }}>
          <path d={facingPath} fill="white" />
        </svg>
      )}
      <AnimatePresence>
        {selectedTokenId === id && (
          <>
            <ArcFab angle={killPosition} onClick={onKillClick}>
              <ClearIcon />
            </ArcFab>
            <ArcFab angle={stashPosition} onClick={onStashClick}>
              <ArchiveIcon />
            </ArcFab>
            <ArcFab angle={trashPosition} onClick={onTrashClick}>
              <DeleteIcon />
            </ArcFab>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const measurementStrategy = {
  [MeasurementStrategy.centerToCenter]: centerToCenterCellDistance,
  [MeasurementStrategy.edgeToEdge]: edgeToEdgeCellDistance,
  [MeasurementStrategy.centerToCenterNormalized]: centerToCenterNormalizedCellDistance,
};
