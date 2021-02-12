import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { ItemTypes } from '../ItemTypes';
import { pathStopped, requestUpdateRemoteRuler } from '../ruler/rulerSlice';
import { selectClaimedGeneratorIds, selectGeneratorById } from '../supply/generatorsSlice';
import { selectIndexWithinGroup, selectTokenById } from './tokenSlice';

export function PlacedToken({ id }) {
  const dispatch = useDispatch();

  const { generator } = useSelector((state) => selectTokenById(state, id));

  const { shapeType, shape } = useSelector((state) => selectGeneratorById(state, generator));

  const index = useSelector((state) => selectIndexWithinGroup(state, { id, generator: generator }));

  const claimedGeneratorIds = useSelector(selectClaimedGeneratorIds);

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.PLACED_TOKEN, id },
    canDrag: () => claimedGeneratorIds.includes(generator),
    begin: (monitor) => console.log('begin', monitor.getClientOffset()),
    end: (item, monitor) => {
      dispatch(pathStopped());
      dispatch(requestUpdateRemoteRuler());
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return {
    figure: <FigureToken ref={drag} index={index} {...shape} />,
    marker: <MarkerToken ref={drag} index={index} {...shape} />,
  }[shapeType];
}
