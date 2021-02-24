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
import { selectIndexWithinGroup, selectTokenById, stashTokenRequested, tokenEntered, tokenLeft, trashTokenRequested } from './tokenSlice';

const TOKEN_SIZE = 48;
const TOKEN_MIDPOINT = TOKEN_SIZE / 2;

export function PlacedToken({ id, showMenu }) {
  const dispatch = useDispatch();

  const { generator } = useSelector((state) => selectTokenById(state, id));

  const { shapeType, shape } = useSelector((state) => selectGeneratorById(state, generator));

  const index = useSelector((state) => selectIndexWithinGroup(state, { id, generator: generator }));

  const onMouseEnter = useCallback(() => dispatch(tokenEntered(id)), [dispatch, id]);
  const onMouseLeave = useCallback(() => dispatch(tokenLeft(id)), [dispatch, id]);

  const onKillClick = useCallback(() => console.log('kill'), []);
  const onStashClick = useCallback(() => dispatch(stashTokenRequested({ id })), [dispatch, id]);
  const onTrashClick = useCallback(() => dispatch(trashTokenRequested({ id })), [dispatch, id]);

  const killPosition = (1 / 4) * Math.PI;
  const stashPosition = (0 / 4) * Math.PI;
  const trashPosition = (7 / 4) * Math.PI;

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {shapeType === 'figure' && <FigureToken index={index} {...shape} />}
      {shapeType === 'marker' && <MarkerToken index={index} {...shape} />}
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

function ArcFab({ children, angle, onClick = () => {}, showMenu }) {
  const startDistance = TOKEN_SIZE * 0;
  const endDistance = TOKEN_SIZE * 1.25;

  const startX = Math.cos(angle) * startDistance;
  const startY = Math.sin(angle) * startDistance

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
