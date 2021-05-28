import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { ItemTypes } from '../ItemTypes';
import { selectClaimedGeneratorIds, selectGeneratorById } from './generatorsSlice';
import { selectIndexWithinGroup, selectTokenById, TokenID } from '../map/tokenSlice';
import { RootState } from '../app/store';

export function StashedToken({ id }: StashTokenProps) {
  const { generator } = useSelector((state: RootState) => selectTokenById(state, id)!);

  const { shapeType, shape } = useSelector((state: RootState) => selectGeneratorById(state, generator)!);

  const index = useSelector((state: RootState) => selectIndexWithinGroup(state, { id, generator: generator }));

  const claimedGeneratorIds = useSelector(selectClaimedGeneratorIds);

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.STASHED_TOKEN, id },
    canDrag: () => claimedGeneratorIds.includes(generator),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return {
    figure: <FigureToken ref={drag} {...shape} index={index} />,
    marker: <MarkerToken ref={drag} {...shape} />,
  }[shapeType];
}

type StashTokenProps = { id: TokenID };