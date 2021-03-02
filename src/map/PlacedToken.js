import Fab from '@material-ui/core/Fab';
import ArchiveIcon from '@material-ui/icons/Archive';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { selectGeneratorById } from '../supply/generatorsSlice';
import {
  selectIndexWithinGroup,
  selectTokenById,
  stashTokenRequested,
  tokenEntered,
  tokenLeft,
  trashTokenRequested,
  selectMenuTokenId,
} from './tokenSlice';

const TOKEN_SIZE = 48;
const TOKEN_MIDPOINT = TOKEN_SIZE / 2;

export function PlacedToken({ id, showMenu }) {
  const dispatch = useDispatch();

  const { position: selfPosition, generator } = useSelector((state) => selectTokenById(state, id));
  const { shapeType, shape: selfShape } = useSelector((state) => selectGeneratorById(state, generator));

  const activeId = useSelector(selectMenuTokenId);
  const { position: activePosition, generator: activeGenerator } = useSelector((state) => selectTokenById(state, activeId)) || {};
  const { shape: activeShape } = useSelector((state) => selectGeneratorById(state, activeGenerator)) || {};

  const index = useSelector((state) => selectIndexWithinGroup(state, { id, generator: generator }));

  const selfScale = (selfShape.baseSize ?? 30) / 30;
  const activeScale = (activeShape?.baseSize ?? 30) / 30;

  const overlay =
    id !== activeId &&
    activePosition &&
    (Math.hypot(activePosition.x - selfPosition.x, activePosition.y - selfPosition.y) / TOKEN_SIZE - selfScale / 2 - activeScale / 2 + 1).toFixed(1);

  const onMouseEnter = useCallback(() => dispatch(tokenEntered(id)), [dispatch, id]);
  const onMouseLeave = useCallback(() => dispatch(tokenLeft(id)), [dispatch, id]);

  const onKillClick = useCallback(() => console.log('kill'), []);
  const onStashClick = useCallback(() => dispatch(stashTokenRequested({ id })), [dispatch, id]);
  const onTrashClick = useCallback(() => dispatch(trashTokenRequested({ id })), [dispatch, id]);

  const killPosition = (1 / 4) * Math.PI;
  const stashPosition = (0 / 4) * Math.PI;
  const trashPosition = (7 / 4) * Math.PI;

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ transform: `scale(${selfScale})` }}>
      {shapeType === 'figure' && <FigureToken index={index} {...selfShape} overlay={overlay} scale={selfScale} />}
      {shapeType === 'marker' && <MarkerToken index={index} {...selfShape} />}
      <AnimatePresence>
        {showMenu && (
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

function ArcFab({ children, angle, onClick = () => {} }) {
  const startDistance = TOKEN_SIZE * 0;
  const endDistance = TOKEN_SIZE * 1.25;

  const startX = Math.cos(angle) * startDistance;
  const startY = Math.sin(angle) * startDistance;

  const endX = Math.cos(angle) * endDistance;
  const endY = Math.sin(angle) * endDistance;
  const delay = 0.3;

  const variants = {
    hidden: { opacity: 0, left: TOKEN_MIDPOINT + startX, top: TOKEN_MIDPOINT - startY, transition: { delay }, pointerEvents: 'none' },
    visible: { opacity: 1, left: TOKEN_MIDPOINT + endX, top: TOKEN_MIDPOINT - endY, transition: { delay }, pointerEvents: 'all' },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      style={{ transform: 'translate(-50%, -50%)', position: 'absolute', zIndex: 100 }}
    >
      <Fab
        color="primary"
        size="small"
        onClick={onClick}
        onMouseDown={(event) => event.stopPropagation()}
        onMouseUp={(event) => event.stopPropagation()}
      >
        {children}
      </Fab>
    </motion.div>
  );
}